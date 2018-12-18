import { Provider, RpcRequest, SubscriptionData } from '../interfaces';
import {
  first,
  filter,
  map,
  share,
  retryWhen,
  delay,
  takeUntil
} from 'rxjs/operators';
import { curry } from 'ramda';
import { QueueingSubject } from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
import { Observable, Subject } from 'rxjs';

interface Config {
  url: string;
}

export function websocketProvider(config: Config): Provider {
  const input = new QueueingSubject<any>();
  const disconnect$ = new Subject<any>();

  const { messages } = jsonWebsocketConnect(config.url, input);

  const message$ = messages.pipe(
    retryWhen(delay(1000)),
    takeUntil(disconnect$),
    share()
  );

  return {
    send: (payload: RpcRequest | RpcRequest[]) => {
      input.next(payload);

      return message$
        .pipe(first(isMatchingResponse(payload)))
        .toPromise() as Promise<any>;
    },
    observe: <T>(subId: string) => {
      return message$
        .pipe(filter(isMatchingSubscription(subId)))
        .pipe(map((x: SubscriptionData<T>) => x.params.result));
    },
    disconnect: () => {
      disconnect$.next();
      disconnect$.complete();
    }
  };
}

const isMatchingSubscription = curry((subId: string, result: any) => {
  return (
    result.method === 'eth_subscription' && result.params.subscription === subId
  );
});

const isMatchingResponse = curry(
  (payload: RpcRequest | RpcRequest[], result: any) => {
    if (Array.isArray(payload)) {
      return (
        Array.isArray(result) &&
        result.length === payload.length &&
        result[0].id === payload[0].id
      );
    } else {
      return result.id === payload.id;
    }
  }
);

function jsonWebsocketConnect(
  url: string,
  input: Observable<any>,
  protocols?: string | string[]
) {
  const jsonInput = input.pipe(map(message => JSON.stringify(message)));
  const { connectionStatus, messages } = websocketConnect(
    url,
    jsonInput,
    protocols
  );
  const jsonMessages = messages.pipe(map(message => JSON.parse(message)));
  return { connectionStatus, messages: jsonMessages };
}
