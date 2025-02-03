// Helper functions for storage persistence
export function persistCookie<T>(store: Writable<T>, cookieName: string): PersistentStore<T> {
  return persist(store, getStorage("cookie"), cookieName)
}

export function persistBrowserSession<T>(store: Writable<T>, key: string): PersistentStore<T> {
  return persist(store, getStorage("session"), key)
}

export function persistBrowserLocal<T>(store: Writable<T>, key: string): PersistentStore<T> {
  return persist(store, getStorage("local"), key)
}

export function localWritable<T>(
  key: string,
  initialValue?: T,
  start?: StartStopNotifier<T>
): PersistentStore<T> {
  return persistBrowserLocal(svelteWritable(initialValue, start), key)
}

export function writable<T>(
  key: string,
  initialValue?: T,
  start?: StartStopNotifier<T>
): PersistentStore<T> {
  return localWritable(key, initialValue, start)
}

export function sessionWritable<T>(
  key: string,
  initialValue?: T,
  start?: StartStopNotifier<T>
): PersistentStore<T> {
  return persistBrowserSession(svelteWritable(initialValue, start), key)
}

export function cookieWritable<T>(
  key: string,
  initialValue?: T,
  start?: StartStopNotifier<T>
): PersistentStore<T> {
  return persistCookie(svelteWritable(initialValue, start), key)
}

// ...

export function persist<T>(
  store: Writable<T>,
  storage: StorageInterface<T>,
  key: string
): PersistentStore<T> {
  const initialValue = storage.getValue(key)

  if (null !== initialValue) {
    store.set(initialValue)
  }

  if ((storage as SelfUpdateStorageInterface<T>).addListener) {
    ;(storage as SelfUpdateStorageInterface<T>).addListener(key, (newValue) => {
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

function createListenerFunctions<T>(
  onFirst: () => void = noop,
  onEmptied: () => void = noop
): {
  callListeners: (eventKey: string, newValue: T) => void;
  addListener: (key: string, listener: (newValue: T) => void) => void;
  removeListener: (key: string, listener: (newValue: T) => void) => void;
} {
  // ...
}

function getBrowserStorage(
  browserStorage: Storage,
  listenExternalChanges = false
): SelfUpdateStorageInterface<unknown> {
  // ...
}

function windowStorageAvailable(name: "localStorage" | "sessionStorage" | "indexedDB"): boolean {
  // ...
}

function createLocalStorage<T>(listenExternalChanges = false): StorageInterface<T> {
  // ...
}

function createSessionStorage<T>(listenExternalChanges = false): StorageInterface<T> {
  // ...
}

function createCookieStorage(cookieOptions?: CookieOptions): StorageInterface<unknown> {
  // ...
}

function createIndexedDBStorage<T>(): SelfUpdateStorageInterface<T> {
  // ...
}

function createChromeStorage<T>(
  storageType: CHROME_STORAGE_TYPE = CHROME_STORAGE_TYPE.LOCAL,
  listenExternalChanges = false
): SelfUpdateStorageInterface<T> {
  // ...
}

function createNoopStorage(): StorageInterface<unknown> {
  // ...
}

function createNoopSelfUpdateStorage(): SelfUpdateStorageInterface<unknown> {
  // ...
}

// ...

interface Encryption {
  hash: (data: string) => string;
  encrypt: (data: string) => string;
  decrypt: (data: string) => string;
}

class GCMEncryption implements Encryption {
  private readonly cipher: any;

  constructor(encryptionKey: string) {
    this.cipher = new sjcl.cipher.aes(fromHex(encryptionKey));
  }

  encrypt(data: string, iv?: string): string {
    // ...
  }

  decrypt(data: string): string {
    // ...
  }

  hash(data: string): string {
    // ...
  }
}

function createEncryptedStorage<T>(
  wrapped: StorageInterface<string>,
  encryptionKey: string
): StorageInterface<T> {
  // ...
}

function createEncryptionStorage<T>(
  wrapped: StorageInterface<string>,
  encryption: Encryption
): StorageInterface<T> {
  // ...
}
