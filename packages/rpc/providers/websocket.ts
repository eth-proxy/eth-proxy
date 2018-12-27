import {
  Provider,
  RpcRequest,
  SubscriptionData,
  RpcResponse
} from '../interfaces';
import {
  first,
  filter,
  map,
  mergeMap,
  multicast,
  retryWhen,
  delay
} from 'rxjs/operators';
import { curry } from 'ramda';
import { Subject, merge, throwError, NEVER } from 'rxjs';
import { QueueingSubject, websocketConnect } from '../utils';

interface Config {
  url: string;
}

export function websocketProvider(config: Config): Provider {
  const input = new QueueingSubject<RpcRequest | RpcRequest[]>();

  const { messages, connectionStatus } = websocketConnect<
    RpcRequest | RpcRequest[],
    RpcResponse
  >(config.url, input);

  const errorOnClosed$ = connectionStatus.pipe(
    mergeMap(x => (x === 0 ? throwError('Connection closed') : NEVER))
  );

  const message$ = messages.pipe(retryWhen(delay(1000)));

  const multicastMessages$ = multicast(() => new Subject<RpcResponse>())(
    message$
  );
  const sub = multicastMessages$.connect();

  return {
    send: (payload: RpcRequest | RpcRequest[]) => {
      input.next(payload);

      return multicastMessages$
        .pipe(
          first(x => isMatchingResponse(payload, x)),
          mergeMap(validateResponse)
        )
        .toPromise() as Promise<RpcResponse>;
    },
    observe: <T>(subId: string) => {
      return merge(multicastMessages$, errorOnClosed$).pipe(
        filter(isMatchingSubscription(subId)),
        map((x: SubscriptionData<T>) => x.params.result)
      );
    },
    disconnect: () => sub.unsubscribe()
  };
}

const isMatchingSubscription = curry((subId: string, result: any) => {
  return (
    result.method === 'eth_subscription' && result.params.subscription === subId
  );
});

const isMatchingResponse = curry(
  (payload: RpcRequest | RpcRequest[], result: RpcResponse) => {
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

function validateResponse(response: RpcResponse) {
  if ('error' in response) {
    return Promise.reject(response.error);
  }
  return Promise.resolve(response);
}
