import { Provider, FilterObject, Omit, Log } from '../interfaces';
import { Observable, ReplaySubject, from } from 'rxjs';
import { first, mergeMap, map, mergeAll, tap } from 'rxjs/operators';
import { subscribe, getLogs, unsubscribe } from '../methods';
import { fromLog } from '../converters';
import { curry } from 'ramda';

interface SubscriptionCreated {
  type: 'SubscriptionCreated';
}

interface CatchedUp {
  type: 'CatchedUp';
}

interface Unsubscribed {
  type: 'Unsubscribed';
}

export type LifecycleEvent = SubscriptionCreated | CatchedUp | Unsubscribed;

export const ofType = (type: LifecycleEvent['type']) => (
  lifecycle$: Observable<LifecycleEvent>
) => lifecycle$.pipe(first(x => x.type === type));

export const subscribeLogsFrom = curry(
  (
    provider: Provider,
    { address, fromBlock }: Omit<FilterObject, 'toBlock'>
  ) => {
    return new Observable<Log>(observer => {
      const lifecycle$ = new ReplaySubject<LifecycleEvent>();

      let subId: string | null = null;
      const subId$ = subscribe(provider, {
        type: 'logs',
        args: { address }
      });

      const liveEvent$ = from(subId$).pipe(
        mergeMap(id => {
          subId = id;
          lifecycle$.next({ type: 'SubscriptionCreated' });

          return provider.observe(id).pipe(map(fromLog));
        }),
        tap({
          error: () => {
            subId = null;
          }
        })
      );

      const pastEvents$ = getLogs(provider, {
        address,
        fromBlock
      });

      const pastSub = lifecycle$
        .pipe(
          ofType('SubscriptionCreated'),
          mergeMap(() => pastEvents$),
          mergeAll()
        )
        .subscribe({
          next: e => observer.next(e),
          error: e => observer.error(e),
          complete: () => lifecycle$.next({ type: 'CatchedUp' })
        });

      const liveSub = liveEvent$.subscribe({
        next: e => {
          lifecycle$
            .pipe(ofType('CatchedUp'))
            .subscribe(() => observer.next(e));
        },
        error: e => observer.error(e)
      });

      return () => {
        if (subId) {
          unsubscribe(provider, subId);
        }
        lifecycle$.complete();
        pastSub.unsubscribe();
        liveSub.unsubscribe();
      };
    });
  }
);
