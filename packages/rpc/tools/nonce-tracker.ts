import { SubscribableOrPromise, BehaviorSubject, forkJoin } from 'rxjs';
import { Dictionary } from 'ramda';
import { map, first, tap, take } from 'rxjs/operators';
import { isNotNil } from 'rpc/utils';

export interface NonceTracker {
  up: (address: string) => SubscribableOrPromise<number>;
  down: (address: string) => SubscribableOrPromise<number>;
}

export type NonceLoader = (address: string) => SubscribableOrPromise<number>;

export function createNonceTracker(loadNonce: NonceLoader): NonceTracker {
  const store = new BehaviorSubject<Dictionary<number>>({});

  const current = (address: string) => {
    return forkJoin(
      store.pipe(
        map(x => x[address] || 0),
        take(1)
      ),
      loadNonce(address)
    ).pipe(
      map(([latest, onchain]) => Math.max(latest, onchain)),
      first(isNotNil)
    );
  };

  return {
    up: address => {
      return current(address).pipe(
        tap({
          next: curr => {
            store.next({ ...store.value, [address]: curr + 1 });
          }
        })
      );
    },
    down: address => {
      return current(address).pipe(
        tap({
          next: curr => {
            store.next({ ...store.value, [address]: curr - 1 });
          }
        })
      );
    }
  };
}
