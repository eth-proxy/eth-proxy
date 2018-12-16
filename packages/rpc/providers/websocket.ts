import { webSocket, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { Provider, RpcRequest, SubscriptionData } from '../interfaces';
import { first, filter, map } from 'rxjs/operators';
import { curry } from 'ramda';

export function websocketProvider(
  config: string | WebSocketSubjectConfig<any>
): Provider {
  const ws = webSocket(config);
  ws.subscribe();

  return {
    send: (payload: RpcRequest | RpcRequest[]) => {
      ws.next(payload);

      return ws.pipe(first(isMatchingResponse(payload))).toPromise() as Promise<
        any
      >;
    },
    observe: <T>(subId: string) => {
      return ws
        .pipe(filter(isMatchingSubscription(subId)))
        .pipe(map((x: SubscriptionData<T>) => x.params.result));
    },
    disconnect: ws.unsubscribe.bind(ws)
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
