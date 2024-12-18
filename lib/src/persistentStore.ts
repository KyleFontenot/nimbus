
import { writable as svelteWritable } from "svelte/store"
import type { Writable, StartStopNotifier } from "svelte/store"

type StorageType = "cookie" | "local" | "session"
const sharedStorage: { [type in StorageType]?: StorageInterface<any> } = {}

function getStorage(type: StorageType): StorageInterface<any> {
  if (!Object.keys(sharedStorage).includes(type)) {
    switch (type) {
      case "cookie":
        sharedStorage[type] = createCookieStorage()
        break
      case "local":
        sharedStorage[type] = createLocalStorage()
        break
      case "session":
        sharedStorage[type] = createSessionStorage()
        break
    }
  }
  return sharedStorage[type] as StorageInterface<any>
}

/**
 * Persist a store into a cookie
 * @param {Writable<*>} store The store to enhance
 * @param {string} cookieName The name of the cookie
 */
export function persistCookie<T>(store: Writable<T>, cookieName: string): PersistentStore<T> {
  return persist(store, getStorage("cookie"), cookieName)
}
/**
 * Persist a store into the browser session storage
 * @param {Writable<*>} store The store to enhance
 * @param {string} key The name of the key in the browser session storage
 */
export function persistBrowserSession<T>(store: Writable<T>, key: string): PersistentStore<T> {
  return persist(store, getStorage("session"), key)
}
/**
 * Persist a store into the browser local storage
 * @param {Writable<*>} store The store to enhance
 * @param {string} key The name of the key in the browser local storage
 */
export function persistBrowserLocal<T>(store: Writable<T>, key: string): PersistentStore<T> {
  return persist(store, getStorage("local"), key)
}

/**
 * Create a standard Svelte store persisted in Browser LocalStorage
 * @param {string} key The key of the data to persist
 * @param {*} [initialValue] The initial data of the store
 * @param {StartStopNotifier<*>} [start] start and stop notifications for subscriptions
 * @return {PersistentStore<*>}
 */
export function localWritable<T>(key: string, initialValue?: T, start?: StartStopNotifier<T>): PersistentStore<T> {
  return persistBrowserLocal(svelteWritable(initialValue, start), key)
}
/**
 * Create a standard Svelte store persisted in Browser LocalStorage.
 * (Alias of [[localWritable]])
 * @param {string} key The key of the data to persist
 * @param {*} [initialValue] The initial data of the store
 * @param {StartStopNotifier<*>} [start] start and stop notifications for subscriptions
 * @return {PersistentStore<*>}
 */
export function writable<T>(key: string, initialValue?: T, start?: StartStopNotifier<T>): PersistentStore<T> {
  return localWritable(key, initialValue, start)
}
/**
 * Create a standard Svelte store persisted in Browser SessionStorage
 * @param {string} key The key of the data to persist
 * @param {*} [initialValue] The initial data of the store
 * @param {StartStopNotifier<*>} [start] start and stop notifications for subscriptions
 * @return {PersistentStore<*>}
 */
export function sessionWritable<T>(key: string, initialValue?: T, start?: StartStopNotifier<T>): PersistentStore<T> {
  return persistBrowserSession(svelteWritable(initialValue, start), key)
}
/**
 * Create a standard Svelte store persisted in cookie
 * @param {string} key The key of the data to persist
 * @param {*} [initialValue] The initial data of the store
 * @param {StartStopNotifier<*>} [start] start and stop notifications for subscriptions
 * @return {PersistentStore<*>}
 */
export function cookieWritable<T>(key: string, initialValue?: T, start?: StartStopNotifier<T>): PersistentStore<T> {
  return persistCookie(svelteWritable(initialValue, start), key)
}

import {
  serialize as defaultSerializer,
  deserialize as defaultDeserializer,
  addGlobalAllowedClass,
  type ClassDefinition,
} from "@macfja/serializer"
import { get as getCookie, set as setCookie, erase as removeCookie } from "browser-cookies"
import type { CookieOptions } from "browser-cookies"
import { get, set, createStore, del } from "idb-keyval"
import type { Writable } from "svelte/store"


export function disableWarnings(): void {
  noWarnings = true
}

let noWarnings = false

const alreadyWarnFor: Array<string> = []

const warnUser = (message: string) => {
  const isProduction = typeof process !== "undefined" && process.env?.NODE_ENV === "production"

  if (!noWarnings && !alreadyWarnFor.includes(message) && !isProduction) {

    alreadyWarnFor.push(message)
  }
}
/**
 * Add a log to indicate that the requested Storage have not been found.
 * @param {string} storageName
 */
const warnStorageNotFound = (storageName: string) => {
  warnUser(`Unable to find the ${storageName}. No data will be persisted.`)
}

/**
 * Add a class to the allowed list of classes to be serialized
 * @param classDefinition The class to add to the list
 */
export function addSerializableClass(classDefinition: ClassDefinition<any>): void {
  addSerializable(classDefinition)
}

/**
 * The function that will be used to serialize data
 * @internal
 * @private
 * @type {(data: any) => string}
 */
export let serialize = defaultSerializer
/**
 * The function that will be used to deserialize data
 * @internal
 * @private
 * @type {(input: string) => any}
 */
export let deserialize = defaultDeserializer
/**
 * The function used to add a class in the serializer allowed class
 * @type {(classConstructor: ClassDefinition<any>) => void}
 */
let addSerializable = addGlobalAllowedClass

/**
 * Set the serialization functions to use
 * @param {(data: any) => string} serializer The function to use to transform any data into a string
 * @param {(input: string) => any} deserializer The function to use to transform back string into the original data (reverse of the serializer)
 * @param {(classConstructor: ClassDefinition<any>) => void} [addSerializableClass] The function to use to add a class in the serializer/deserializer allowed class
 */
export function setSerialization(
  serializer: (data: any) => string,
  deserializer: (input: string) => any,
  addSerializableClass?: (classConstructor: ClassDefinition<any>) => void
): void {
  serialize = serializer
  deserialize = deserializer
  addSerializable =
    addSerializableClass ??
    (() => {
      return
    })
}

/**
 * A store that keep its value in time.
 */
export interface PersistentStore<T> extends Writable<T> {
  /**
   * Delete the store value from the persistent storage
   */
  delete(): void
}

/**
 * Storage interface
 */
export interface StorageInterface<T> {
  /**
   * Get a value from the storage.
   *
   * If the value doesn't exist in the storage, `null` should be returned.
   * This method MUST be synchronous.
   * @param key The key/name of the value to retrieve
   */
  getValue(key: string): T | null

  /**
   * Save a value in the storage.
   * @param key The key/name of the value to save
   * @param value The value to save
   */
  setValue(key: string, value: T): void

  /**
   * Remove a value from the storage
   * @param key The key/name of the value to remove
   */
  deleteValue(key: string): void
}

export interface SelfUpdateStorageInterface<T> extends StorageInterface<T> {
  /**
   * Add a listener to the storage values changes
   * @param {string} key The key to listen
   * @param {(newValue: T) => void} listener The listener callback function
   */
  addListener(key: string, listener: (newValue: T) => void): void
  /**
   * Remove a listener from the storage values changes
   * @param {string} key The key that was listened
   * @param {(newValue: T) => void} listener The listener callback function to remove
   */
  removeListener(key: string, listener: (newValue: T) => void): void
}

/**
 * Make a store persistent
 * @param {Writable<*>} store The store to enhance
 * @param {StorageInterface} storage The storage to use
 * @param {string} key The name of the data key
 */
export function persist<T>(store: Writable<T>, storage: StorageInterface<T>, key: string): PersistentStore<T> {
  const initialValue = storage.getValue(key)

  if (null !== initialValue) {
    store.set(initialValue)
  }

  if ((storage as SelfUpdateStorageInterface<T>).addListener) {
    ; (storage as SelfUpdateStorageInterface<T>).addListener(key, (newValue) => {
      store.set(newValue)
    })
  }

  store.subscribe((value) => {
    storage.setValue(key, value)
  })

  return {
    ...store,
    delete() {
      storage.deleteValue(key)
    },
  }
}

function noop() {
  return
}

/**
 * Create helper function to use asynchronous storage
 * @param {() => void} onFirst Function to run every time the number of listener goes from 0 to 1
 * @param {() => void} onEmptied Function to run every tie the number of listener goes from 1 to 0
 * @return {{callListeners: (eventKey: string, newValue: any) => void, addListener: (key: string, listener: (newValue: any) => void) => void, removeListener: (key: string, listener: (newValue: any) => void) => void}}
 */
function createListenerFunctions<T>(
  onFirst: () => void = noop,
  onEmptied: () => void = noop
): {
  callListeners: (eventKey: string, newValue: T) => void
  addListener: (key: string, listener: (newValue: T) => void) => void
  removeListener: (key: string, listener: (newValue: T) => void) => void
} {
  const listeners: Array<{ key: string; listener: (newValue: T) => void }> = []
  return {
    callListeners(eventKey: string, newValue: T) {
      if (newValue === undefined) {
        return
      }
      listeners.filter(({ key }) => key === eventKey).forEach(({ listener }) => listener(newValue))
    },
    addListener(key: string, listener: (newValue: any) => void) {
      listeners.push({ key, listener })
      if (listeners.length === 1) onFirst()
    },
    removeListener(key: string, listener: (newValue: any) => void) {
      const index = listeners.indexOf({ key, listener })
      if (index !== -1) {
        listeners.splice(index, 1)
      }
      if (listeners.length === 0) onEmptied()
    },
  }
}

function getBrowserStorage(browserStorage: Storage, listenExternalChanges = false): SelfUpdateStorageInterface<any> {
  const listenerFunction = (event: StorageEvent) => {
    const eventKey = event.key
    if (event.storageArea === browserStorage) {
      callListeners(eventKey, deserialize(event.newValue))
    }
  }
  const connect = () => {
    if (listenExternalChanges && typeof window !== "undefined" && window?.addEventListener) {
      window.addEventListener("storage", listenerFunction)
    }
  }
  const disconnect = () => {
    if (listenExternalChanges && typeof window !== "undefined" && window?.removeEventListener) {
      window.removeEventListener("storage", listenerFunction)
    }
  }
  const { removeListener, callListeners, addListener } = createListenerFunctions<any>(connect, disconnect)

  return {
    addListener,
    removeListener,
    getValue(key: string): any | null {
      const value = browserStorage.getItem(key)
      return deserialize(value)
    },
    deleteValue(key: string) {
      browserStorage.removeItem(key)
    },
    setValue(key: string, value: any) {
      browserStorage.setItem(key, serialize(value))
    },
  }
}

function windowStorageAvailable(name: "localStorage" | "sessionStorage" | "indexedDB"): boolean {
  try {
    return typeof window[name] === "object"
  } catch {
    return false
  }
}

/**
 * Storage implementation that use the browser local storage
 * @param {boolean} listenExternalChanges Update the store if the localStorage is updated from another page
 */
export function createLocalStorage<T>(listenExternalChanges = false): StorageInterface<T> {
  if (windowStorageAvailable("localStorage")) {
    return getBrowserStorage(window.localStorage, listenExternalChanges)
  }
  warnStorageNotFound("window.localStorage")
  return createNoopStorage()
}

/**
 * Storage implementation that use the browser session storage
 * @param {boolean} listenExternalChanges Update the store if the sessionStorage is updated from another page
 */
export function createSessionStorage<T>(listenExternalChanges = false): StorageInterface<T> {
  if (windowStorageAvailable("sessionStorage")) {
    return getBrowserStorage(window.sessionStorage, listenExternalChanges)
  }
  warnStorageNotFound("window.sessionStorage")
  return createNoopStorage()
}

/**
 * Storage implementation that use the browser cookies
 */
export function createCookieStorage(cookieOptions?: CookieOptions): StorageInterface<any> {
  if (typeof document === "undefined" || typeof document?.cookie !== "string") {
    warnStorageNotFound("document.cookies")
    return createNoopStorage()
  }

  return {
    getValue(key: string): any | null {
      const value = getCookie(key)
      return deserialize(value)
    },
    deleteValue(key: string) {
      removeCookie(key, { samesite: "Strict", ...cookieOptions })
    },
    setValue(key: string, value: any) {
      setCookie(key, serialize(value), { samesite: "Strict", ...cookieOptions })
    },
  }
}

/**
 * Storage implementation that use the browser IndexedDB
 */
export function createIndexedDBStorage<T>(): SelfUpdateStorageInterface<T> {
  if (typeof indexedDB !== "object" || !windowStorageAvailable("indexedDB")) {
    warnStorageNotFound("IndexedDB")
    return createNoopSelfUpdateStorage()
  }

  const { removeListener, callListeners, addListener } = createListenerFunctions<T>()
  const database = createStore("svelte-persist", "persist")
  return {
    addListener,
    removeListener,
    getValue(key: string): T | null {
      get(key, database).then((value) => callListeners(key, deserialize(value) as T))
      return null
    },
    setValue(key: string, value: T): void {
      set(key, serialize(value), database)
    },
    deleteValue(key: string): void {
      del(key, database)
    },
  }
}

export enum CHROME_STORAGE_TYPE {
  LOCAL,
  SESSION,
  SYNC,
}
export function createChromeStorage<T>(
  storageType: CHROME_STORAGE_TYPE = CHROME_STORAGE_TYPE.LOCAL,
  listenExternalChanges = false
): SelfUpdateStorageInterface<T> {
  if (typeof chrome !== "object" || typeof chrome.storage !== "object") {
    warnStorageNotFound("ChromeStorage")
    return createNoopSelfUpdateStorage()
  }

  let area = "local"
  switch (storageType) {
    case CHROME_STORAGE_TYPE.LOCAL:
      area = "local"
      break
    case CHROME_STORAGE_TYPE.SYNC:
      area = "sync"
      break
    case CHROME_STORAGE_TYPE.SESSION:
      area = "session"
      break
  }

  function externalChangesListener(changes: Record<string, { oldValue: T; newValue: T }>, areaName) {
    if (areaName !== area) return
    for (const [key, { newValue }] of Object.entries(changes)) {
      callListeners(key, newValue)
    }
  }

  const { removeListener, callListeners, addListener } = createListenerFunctions<T>(
    () => {
      if (listenExternalChanges) {
        chrome.storage.onChanged.addListener(externalChangesListener)
      }
    },
    () => {
      if (listenExternalChanges) {
        chrome.storage.onChanged.removeListener(externalChangesListener)
      }
    }
  )

  return {
    addListener,
    removeListener,
    getValue(key: string): T | null {
      chrome.storage[area].get([key], (result) => callListeners(key, result.key))
      return null
    },
    setValue(key: string, value: T): void {
      chrome.storage[area].set({ [key]: value })
    },
    deleteValue(key: string): void {
      chrome.storage[area].remove(key)
    },
  }
}

/**
 * Storage implementation that do nothing
 */
export function createNoopStorage(): StorageInterface<any> {
  return {
    getValue(): null {
      return null
    },
    deleteValue() {
      // Do nothing
    },
    setValue() {
      // Do nothing
    },
  }
}

function createNoopSelfUpdateStorage(): SelfUpdateStorageInterface<any> {
  return {
    ...createNoopStorage(),
    addListener() {
      // Do nothing
    },
    removeListener() {
      // Do nothing
    },
  }
}

import toHex from "sjcl-codec-hex/from-bits"
import fromHex from "sjcl-codec-hex/to-bits"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import sjcl from "sjcl-es"

import { deserialize, serialize } from "./core"
import type { StorageInterface } from "./core"

/**
 * The behavior when no encryption library is available when requesting an encrypted storage
 * @deprecated
 */
export enum NO_ENCRYPTION_BEHAVIOR {
  /**
   * Throw an exception
   */
  EXCEPTION = 0,
  /**
   * Use the wrapped Storage as-is
   */
  NO_ENCRYPTION = 1,
  /**
   * Don't use any storage, so no not encrypted data will be persisted
   */
  NO_STORAGE = 2,
}

/**
 * Set the behavior when no encryption library is available when requesting an encrypted storage
 * @deprecated
 * @param behavior
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function noEncryptionBehavior(behavior: NO_ENCRYPTION_BEHAVIOR): void {
  // Do nothing
}

/**
 * The encryption interface
 */
export interface Encryption {
  /**
   * Hash the input data
   * @param {string} data The data to hash
   * @return {string} The hashed data
   */
  hash: (data: string) => string
  /**
   * Encrypt the input data.
   *
   * Must be reversible with `decrypt` function.
   * @param {string} data The data to encrypt
   * @return {string} The encrypted data
   */
  encrypt: (data: string) => string
  /**
   * Decrypt the input data.
   *
   * Must be reversible with `encrypt` function.
   * @param {string} data The data to decrypt
   * @return {string} The decrypted data
   */
  decrypt: (data: string) => string
}

/**
 * Encryption implementation with AES-256-GCM
 */
export class GCMEncryption implements Encryption {
  /**
   * The AES cipher to use for hashing, encrypting and decrypting
   * @private
   */
  private readonly cipher

  /**
   * The GCM Encryption constructor
   * @param {string} encryptionKey The HEX key to use for encryption
   */
  constructor(encryptionKey: string) {
    this.cipher = new sjcl.cipher.aes(fromHex(encryptionKey))
  }

  /**
   * Encrypt the input data.
   *
   * @param {string} data The data to encrypt
   * @param {string} [iv] The IV to use during the encryption (default to "sps")
   * @return {string} The encrypted data
   */
  encrypt(data: string, iv?: string | undefined): string {
    if (!iv) iv = "sps"
    const encodedIv = sjcl.codec.utf8String.toBits(iv)
    return (
      toHex(sjcl.mode.gcm.encrypt(this.cipher, sjcl.codec.utf8String.toBits(data), encodedIv, [], 256)) +
      ":" +
      toHex(encodedIv)
    )
  }

  /**
   * Encrypt the input data.
   *
   * The IV is extracted from the encrypted data.
   *
   * @param {string} data The data to decrypt
   * @return {string} The decrypted data
   */
  decrypt(data: string): string {
    return sjcl.codec.utf8String.fromBits(
      sjcl.mode.gcm.decrypt(this.cipher, fromHex(data.split(":")[0]), fromHex(data.split(":")[1]))
    )
  }

  /**
   * Hash the input data.
   *
   * Use the encrypt function with the IV set to "sps"
   *
   * @param {string} data The data to hash
   * @return {string} The hashed data
   */
  hash(data: string): string {
    return this.encrypt(data, "sps")
  }
}

/**
 * Add encryption layer on a storage
 * @deprecated Use createEncryptionStorage instead
 * @param wrapped The storage to enhance
 * @param encryptionKey The encryption key to use on key and data
 */
export function createEncryptedStorage<T>(
  wrapped: StorageInterface<string>,
  encryptionKey: string
): StorageInterface<T> {
  const encryption = new GCMEncryption(encryptionKey)
  return createEncryptionStorage(wrapped, encryption)
}

/**
 * Add encryption layer on a storage
 * @param wrapped The storage to enhance
 * @param encryption The encryption to use on key and data
 */
export function createEncryptionStorage<T>(
  wrapped: StorageInterface<string>,
  encryption: Encryption
): StorageInterface<T> {
  return {
    getValue(key: string): T | null {
      const encryptedKey = encryption.hash(key)
      const storageValue = wrapped.getValue(encryptedKey)
      if (storageValue === null) return null
      return deserialize(encryption.decrypt(storageValue))
    },
    setValue(key: string, value: T): void {
      const encryptedKey = encryption.hash(key)
      const encryptedValue = encryption.encrypt(serialize(value))
      wrapped.setValue(encryptedKey, encryptedValue)
    },
    deleteValue(key: string): void {
      const encryptedKey = encryption.hash(key)
      wrapped.deleteValue(encryptedKey)
    },
  }
}



