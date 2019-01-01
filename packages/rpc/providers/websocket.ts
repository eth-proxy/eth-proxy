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
  delay,
  tap
} from 'rxjs/operators';
import { curry } from 'ramda';
import { Subject, merge, throwError, NEVER } from 'rxjs';
import { QueueingSubject, websocketConnect } from '../utils';
import { isMatchingResponse, validateResponse } from './utils';

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
    send: req => {
      input.next(req);

      return multicastMessages$
        .pipe(
          first(res => isMatchingResponse(req, res)),
          tap(validateResponse)
        )
        .toPromise() as Promise<any>;
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
