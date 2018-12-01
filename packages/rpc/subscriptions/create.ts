import { PubSubProvider } from '../interfaces';
import { filter, first, map, finalize, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

let id = 1;

export function createSubscription<I, O>(provider: PubSubProvider, params: I) {
  const notification$ = provider.observe.pipe(filter(isResult)) as Observable<
    SubscriptionNotification<O>
  >;
  const creation$ = provider.observe.pipe(filter(isCreated));
  const unsubscribe = (subId: string) => {
    provider.next({
      id: id++,
      jsonrpc: '2.0',
      method: 'eth_unsubscribe',
      params: [subId]
    });
  };

  const requestId = id++;

  provider.next({
    id: requestId,
    jsonrpc: '2.0',
    method: 'eth_subscribe',
    params
  });

  return creation$.pipe(
    first(x => x.id === requestId),
    map(x => x.result),
    mergeMap(subId => {
      return notification$.pipe(
        filter(next => next.params.subscription === subId),
        map(x => x.params.result),
        finalize(() => unsubscribe(subId))
      );
    })
  );
}

interface SubscriptionCreated {
  jsonrpc: '2.0';
  id: number;
  result: string;
}

interface SubscriptionNotification<T> {
  jsonrpc: '2.0';
  method: 'eth_subscription';
  params: {
    subscription: string;
    result: T;
  };
}

type SubscriptionEvent<T> = SubscriptionCreated | SubscriptionNotification<T>;

function isResult<T>(
  x: SubscriptionEvent<T>
): x is SubscriptionNotification<T> {
  return 'method' in x;
}

function isCreated<T>(x: SubscriptionEvent<T>): x is SubscriptionCreated {
  return 'id' in x;
}
