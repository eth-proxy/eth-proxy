/// <reference lib="dom" />
import { Observable, Subscription, BehaviorSubject } from 'rxjs';

export interface Connection<T> {
  connectionStatus: Observable<number>;
  messages: Observable<T>;
}

export type WebSocketFactory = (
  url: string,
  protocols?: string | string[]
) => WebSocket;

const defaultWebsocketFactory = (url: string, protocols?: string | string[]) =>
  new WebSocket(url, protocols);

export function websocketConnect<I, O>(
  url: string,
  input: Observable<I>,
  protocols?: string | string[],
  websocketFactory: WebSocketFactory = defaultWebsocketFactory
): Connection<O> {
  const connectionStatus = new BehaviorSubject<number>(0);

  const messages = new Observable<O>(observer => {
    const socket = websocketFactory(url, protocols);
    let inputSubscription: Subscription;

    let open = false;
    let forcedClose = false;

    const closed = () => {
      if (!open) {
        return;
      }

      connectionStatus.next(connectionStatus.getValue() - 1);
      open = false;
    };

    socket.onopen = () => {
      open = true;
      connectionStatus.next(connectionStatus.getValue() + 1);
      inputSubscription = input.subscribe(data => {
        socket.send(JSON.stringify(data));
      });
    };

    socket.onmessage = (message: MessageEvent) => {
      observer.next(JSON.parse(message.data));
    };

    socket.onerror = (error: Event) => {
      closed();
      observer.error(error);
    };

    socket.onclose = (event: CloseEvent) => {
      // prevent observer.complete() being called after observer.error(...)
      if (!open) {
        return;
      }

      closed();
      if (forcedClose) {
        observer.complete();
      } else {
        observer.error(new Error(event.reason));
      }
    };

    return () => {
      forcedClose = true;
      if (inputSubscription) {
        inputSubscription.unsubscribe();
      }

      if (open) {
        closed();
        socket.close();
      }
    };
  });

  return { messages, connectionStatus };
}
