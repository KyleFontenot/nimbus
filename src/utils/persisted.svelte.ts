/**
 * Persisted reactive state for Svelte 5 (and a classic Svelte store variant).
 *
 *   import persisted, { persistedStore } from "@kfont/nimbus/utils/persisted.svelte";
 *
 *   const theme = persisted("light", { key: "theme" });          // localStorage
 *   theme.current = "dark";                                      // reactive + persisted
 *
 *   const draft = persisted({ title: "" }, { key: "draft", storage: "indexeddb" });
 *   draft.current.title = "Hello";                               // deep mutation persists too
 *   await draft.ready;                                           // IndexedDB loads async
 *
 *   const legacy = persistedStore(0, { key: "count" });          // $legacy in .svelte files
 *
 * Client-side only: on the server it behaves like plain in-memory state.
 */
import { onDestroy } from "svelte";
import { writable } from "svelte/store";
import type { Readable, Writable } from "svelte/store";

export type StorageType = "localStorage" | "sessionStorage" | "indexeddb";

export interface PersistedOptions<T> {
	/** Key the value is stored under. */
	key: string;
	/** Where to persist. Defaults to `"localStorage"`. */
	storage?: StorageType;
	/** Web Storage only. Defaults to `JSON.stringify`. IndexedDB stores structured clones instead. */
	serialize?: (value: T) => string;
	/** Web Storage only. Defaults to `JSON.parse`. */
	deserialize?: (raw: string) => T;
	/** IndexedDB database name. Defaults to `"nimbus"`. */
	dbName?: string;
	/** IndexedDB object store name. Defaults to `"persisted"`. */
	storeName?: string;
	/** Keep other tabs in sync (storage event / BroadcastChannel). Defaults to `true`. */
	sync?: boolean;
}

export interface PersistedStore<T> extends Writable<T> {
	/** Resolves once the stored value has been loaded (immediately for Web Storage). */
	ready: Promise<void>;
	/** Delete the key from storage. The in-memory value is untouched. */
	remove: () => void;
	/** Stop listening for cross-tab changes and stop persisting. */
	destroy: () => void;
}

export interface PersistedState<T> {
	/** The reactive, persisted value. Assign to it or mutate it deeply. */
	current: T;
	/** True once the stored value has been loaded. */
	readonly loaded: boolean;
	/** Resolves once the stored value has been loaded (immediately for Web Storage). */
	readonly ready: Promise<void>;
	/** Set the value back to the initial value (and persist it). */
	reset: () => void;
	/** Delete the key from storage. The in-memory value is untouched. */
	remove: () => void;
	/** Stop the sync effect and cross-tab listeners. Called automatically inside components. */
	destroy: () => void;
}

type MaybePromise<V> = V | Promise<V>;

interface Persistence<T> {
	/** Load the stored value; `undefined` means nothing stored. */
	load: () => MaybePromise<T | undefined>;
	write: (value: T) => void;
	remove: () => void;
	destroy: () => void;
}

const isBrowser = () => typeof window !== "undefined";

function fingerprint(value: unknown): string | undefined {
	try {
		return JSON.stringify(value);
	} catch {
		return undefined;
	}
}

/* ------------------------------------------------------------------ */
/* IndexedDB plumbing                                                 */
/* ------------------------------------------------------------------ */

const dbCache = new Map<string, Promise<IDBDatabase>>();

function openDb(dbName: string, storeName: string): Promise<IDBDatabase> {
	const cacheKey = `${dbName}/${storeName}`;
	const cached = dbCache.get(cacheKey);
	if (cached) return cached;

	const promise = new Promise<IDBDatabase>((resolve, reject) => {
		const open = (version?: number) => {
			const req = indexedDB.open(dbName, version);
			req.onupgradeneeded = () => {
				if (!req.result.objectStoreNames.contains(storeName)) {
					req.result.createObjectStore(storeName);
				}
			};
			req.onsuccess = () => {
				const db = req.result;
				if (db.objectStoreNames.contains(storeName)) {
					// If another store later needs creating, close so the upgrade isn't blocked.
					db.onversionchange = () => {
						db.close();
						dbCache.delete(cacheKey);
					};
					return resolve(db);
				}
				// Database exists (e.g. created for another store) but lacks ours: bump version.
				const next = db.version + 1;
				db.close();
				open(next);
			};
			req.onerror = () => reject(req.error);
		};
		open();
	});
	promise.catch(() => dbCache.delete(cacheKey));
	dbCache.set(cacheKey, promise);
	return promise;
}

function idbRequest<R>(req: IDBRequest<R>): Promise<R> {
	return new Promise((resolve, reject) => {
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

/* ------------------------------------------------------------------ */
/* Persistence core, shared by the store and the rune state            */
/* ------------------------------------------------------------------ */

function createPersistence<T>(
	opts: PersistedOptions<T>,
	onExternal: (value: T | undefined) => void,
): Persistence<T> {
	const {
		key,
		storage = "localStorage",
		serialize = JSON.stringify,
		deserialize = JSON.parse,
		dbName = "nimbus",
		storeName = "persisted",
		sync = true,
	} = opts;

	// Last value we know is in storage; used to avoid write -> broadcast -> write loops.
	let last: string | undefined;
	const noop: Persistence<T> = {
		load: () => undefined,
		write: () => {},
		remove: () => {},
		destroy: () => {},
	};

	if (!isBrowser()) return noop;

	if (storage === "indexeddb") {
		if (typeof indexedDB === "undefined") return noop;

		let chain: Promise<unknown> = Promise.resolve();
		// Serialise operations so writes land in call order.
		const enqueue = <R>(fn: () => Promise<R>) => {
			const run = chain.then(fn);
			chain = run.catch(() => {});
			return run;
		};
		const read = async () => {
			const db = await openDb(dbName, storeName);
			return idbRequest(
				db.transaction(storeName).objectStore(storeName).get(key),
			) as Promise<T | undefined>;
		};

		const channel =
			sync && typeof BroadcastChannel !== "undefined"
				? new BroadcastChannel(`${dbName}/${storeName}/${key}`)
				: undefined;
		if (channel) {
			channel.onmessage = async () => {
				const value = await enqueue(read).catch(() => undefined);
				last = fingerprint(value);
				onExternal(value);
			};
		}

		return {
			load: async () => {
				const value = await enqueue(read);
				last = fingerprint(value);
				return value;
			},
			write(value) {
				const fp = fingerprint(value);
				if (fp !== undefined && fp === last) return;
				last = fp;
				enqueue(async () => {
					const db = await openDb(dbName, storeName);
					const tx = db.transaction(storeName, "readwrite");
					tx.objectStore(storeName).put(value, key);
					await new Promise<void>((resolve, reject) => {
						tx.oncomplete = () => resolve();
						tx.onerror = () => reject(tx.error);
						tx.onabort = () => reject(tx.error);
					});
					channel?.postMessage(null);
				}).catch((err) =>
					console.error(`[persisted] failed to write "${key}"`, err),
				);
			},
			remove() {
				last = undefined;
				enqueue(async () => {
					const db = await openDb(dbName, storeName);
					await idbRequest(
						db
							.transaction(storeName, "readwrite")
							.objectStore(storeName)
							.delete(key),
					);
					channel?.postMessage(null);
				}).catch((err) =>
					console.error(`[persisted] failed to remove "${key}"`, err),
				);
			},
			destroy: () => channel?.close(),
		};
	}

	// Web Storage (localStorage / sessionStorage)
	let area: Storage;
	try {
		area = storage === "sessionStorage" ? sessionStorage : localStorage;
	} catch {
		return noop; // blocked (privacy mode, sandboxed iframe, ...)
	}

	const parse = (raw: string | null): T | undefined => {
		if (raw === null) return undefined;
		try {
			return deserialize(raw);
		} catch {
			return undefined; // corrupted entry: fall back to the initial value
		}
	};

	const onStorage = (e: StorageEvent) => {
		if (e.storageArea !== area) return;
		if (e.key !== null && e.key !== key) return;
		last = e.newValue ?? undefined;
		onExternal(parse(e.newValue));
	};
	if (sync) window.addEventListener("storage", onStorage);

	return {
		load() {
			const raw = area.getItem(key);
			last = raw ?? undefined;
			return parse(raw);
		},
		write(value) {
			try {
				const raw = serialize(value);
				if (raw === last) return;
				last = raw;
				area.setItem(key, raw);
			} catch (err) {
				console.error(`[persisted] failed to write "${key}"`, err);
			}
		},
		remove() {
			last = undefined;
			try {
				area.removeItem(key);
			} catch {}
		},
		destroy: () => window.removeEventListener("storage", onStorage),
	};
}

/* ------------------------------------------------------------------ */
/* Classic Svelte store (use as `$name` in components)                 */
/* ------------------------------------------------------------------ */

export function persistedStore<T>(
	initial: T,
	options: PersistedOptions<T>,
): PersistedStore<T> {
	const internal = writable<T>(initial);
	let touched = false; // user set a value before async hydration finished

	const persistence = createPersistence<T>(options, (value) => {
		// External change (other tab). `undefined` means the key was removed.
		internal.set(value === undefined ? initial : value);
	});

	const loaded = persistence.load();
	const apply = (value: T | undefined) => {
		if (value !== undefined && !touched) internal.set(value);
	};
	let ready: Promise<void>;
	if (loaded instanceof Promise) {
		ready = loaded.then(apply, (err) => {
			console.error(`[persisted] failed to load "${options.key}"`, err);
		});
	} else {
		apply(loaded);
		ready = Promise.resolve();
	}

	const set = (value: T) => {
		touched = true;
		internal.set(value);
		persistence.write(value);
	};

	return {
		subscribe: internal.subscribe,
		set,
		update(fn) {
			let next!: T;
			internal.update((v) => (next = fn(v)));
			touched = true;
			persistence.write(next);
		},
		ready,
		remove: persistence.remove,
		destroy: persistence.destroy,
	};
}

/* ------------------------------------------------------------------ */
/* Svelte 5 rune state (default export)                                */
/* ------------------------------------------------------------------ */

export default function persisted<T>(
	initial: T,
	options: PersistedOptions<T>,
): PersistedState<T> {
	let value = $state<T>(initial);
	let loaded = $state(false);

	const persistence = createPersistence<T>(options, (next) => {
		value = next === undefined ? clone(initial) : next;
	});

	const result = persistence.load();
	let ready: Promise<void>;
	if (result instanceof Promise) {
		ready = result
			.then((stored) => {
				if (stored !== undefined) value = stored;
			})
			.catch((err) => {
				console.error(`[persisted] failed to load "${options.key}"`, err);
			})
			.finally(() => {
				loaded = true;
			});
	} else {
		if (result !== undefined) value = result;
		loaded = true;
		ready = Promise.resolve();
	}

	// Effects need a root because this may be called outside a component.
	const stopEffects = $effect.root(() => {
		$effect(() => {
			// Reads `value` deeply, so nested mutations are persisted too.
			const snapshot = $state.snapshot(value) as T;
			if (loaded) persistence.write(snapshot);
		});
	});

	const destroy = () => {
		stopEffects();
		persistence.destroy();
	};
	try {
		onDestroy(destroy); // throws when not inside a component; then call destroy() yourself
	} catch {}

	return {
		get current() {
			return value;
		},
		set current(next: T) {
			value = next;
		},
		get loaded() {
			return loaded;
		},
		get ready() {
			return ready;
		},
		reset() {
			value = clone(initial);
		},
		remove: persistence.remove,
		destroy,
	};
}

function clone<T>(v: T): T {
	try {
		return structuredClone(v);
	} catch {
		return v;
	}
}

export type { Readable };
