import isJsonString from "./isJson";
import { writable } from "svelte/store";
import type { Readable, Subscriber, Unsubscriber } from "svelte/store";
import { onMount } from "svelte";

interface WSSocketStoreOptions {
  onConnect?: (() => void) | (() => string);
  onMessage?: (message: MessageEvent, set: (message: unknown) => void) => void;
  onClose?: () => void;
  onError?: () => void;
  feed?: boolean;
  useridentifier?: string;
  autoconnect?: boolean;
}

export interface WebSocketStore<T> extends Readable<T> {
  subscribe: (run: Subscriber<T>) => Unsubscriber;
  connect: (overrideUrl?: string) => void;
  close: () => void;
  clear: () => void;
  send: (msg: string | JSON | Record<string, unknown>) => void;
}

export let WSADDRESS: undefined | string = undefined;
try {
  WSADDRESS = `ws://${process.env.VITE_ORIGIN}${process.env.MODE === "development" ? `:${Bun.env.VITE_DEVWSPORT}` : ""}`;
} catch (f) {
  WSADDRESS = `ws://${import.meta.env.VITE_ORIGIN}${import.meta.env.MODE === "development" ? `:${import.meta.env.VITE_DEVWSPORT}` : ""}`;
}
// Client-side only!
export function websocketStore<T>(
  setUrl: string,
  {
    onConnect,
    onMessage,
    onClose = undefined,
    onError,
    feed = false,
    useridentifier,
    autoconnect = true,
  }: WSSocketStoreOptions,
  defaultValue: unknown = null,
): WebSocketStore<T> {
  let retryCounter = 0;
  let retryInterval: undefined | ReturnType<typeof setInterval>;
  // let user = useridentifier || new Date().toISOString();
  const newStore = writable(defaultValue);
  const { subscribe: _subscribe, set: _set, update: _update } = newStore;
  const MAXCOUNTER = 8;
  let url = setUrl;
  let ws: WebSocket | undefined;

  const connect = (overrideUrl?: string) => {
    url = overrideUrl ?? setUrl;
    ws = new WebSocket(
      `${url}${useridentifier ? `?user=${useridentifier}` : ""}`,
    );

    ws.onopen = async (e) => {
      retryCounter = 0;
      // retryInterval;
      clearInterval(retryInterval);
      retryInterval = undefined;
      await waitForOpenConnection(ws);
      if (ws?.readyState === 1) {
        if (onConnect) {
          const onConnectedValue = onConnect();
          onConnectedValue && ws?.send(onConnect() as string);
        }
      }
    };
    ws.onmessage = (msg) => {
      clearInterval(retryInterval);
      if (isJsonString(msg.data)) {
        //  TODO : add in the possiblity fo it being a blob.
        const message: Record<string, unknown> = JSON.parse(msg.data as string);
        if (typeof message === "object" && "type" in message) {
          switch (message.type) {
            case "message": {
              if (feed) {
                _update((prev) => {
                  const _prev = prev.push(message.message);
                  return _prev;
                });
                onMessage?.(msg, _set);
              } else {
                if (onMessage) {
                  onMessage?.(msg, _set);
                } else {
                  _set(message.message);
                }
              }
              break;
            }
            case "join": {
              _update((prev: T) => {
                prev.users = message.message;
                return prev;
              });
              break;
            }
            case "leave": {
              _update((prev) => {
                prev.users = message;
                return prev;
              });
              break;
            }
          }
        }
        return;
      }
      if (onMessage) {
        onMessage(msg.data, _set);
      } else {
        console.log("Received message without a onMessageHandler: ", msg.data);
      }
    };
    ws.onerror = (err) => {
      console.log(`connect_error due to ${JSON.stringify(err)}`);
    };
    ws.onclose = (e) => {
      onClose?.();
      // ws?.send(connectFn)
      // Have it try re-connecting on close after 2000ms in case
      if (retryCounter >= MAXCOUNTER) {
        retryCounter++;
        setTimeout(() => {
          connect(`${url}${useridentifier ? `?user=${useridentifier}` : ""}`);
        }, 2000);
      }
    };
  };
  if (autoconnect) {
    onMount(() => {
      connect();
    });
  }

  const destroy = _subscribe(() => { });
  return {
    subscribe: (run: Subscriber<T>) => _subscribe(run),
    connect,
    // TODO make this async so that it's easy to do something right after connecting
    close() {
      ws?.close();
      ws = undefined;
      destroy();
    },
    clear() {
      _set(null);
    },
    send(msg: string | JSON | Record<string, unknown>) {
      (isJsonString(msg as string) &&
        ws?.send(
          JSON.stringify({
            type: "message",
            message: msg,
          }),
        )) ||
        ws?.send(msg as string);
    },
  };
}

const waitForOpenConnection = (socket) => {
  return new Promise<void>((resolve, reject) => {
    const maxNumberOfAttempts = 10;
    const intervalTime = 30; //ms

    let currentAttempt = 0;
    const interval = setInterval(() => {
      if (currentAttempt > maxNumberOfAttempts - 1) {
        clearInterval(interval);
        reject(new Error("Maximum number of attempts exceeded"));
      } else if (socket.readyState === socket.OPEN) {
        clearInterval(interval);
        resolve();
      }
      currentAttempt++;
    }, intervalTime);
  });
};
