import { createWeb3 } from '../utils';
import { CurriedFunction2, curry } from 'ramda';
import { Observable, forkJoin } from 'rxjs';
import { flatten } from 'ramda';
import { Provider, FilterObject, BlockchainEvent } from '../interfaces';

// TESTRPC WATCH DOES NOT WORK WITH ADDRESS LIST
export const getEvents = curry((provider: Provider, options: FilterObject) => {
  const addressList = Array.isArray(options.address)
    ? options.address
    : [options.address];

  const eventLoader = getAddressEvents(provider);

  const eventLoaders$ = addressList.map(address =>
    eventLoader(
      Object.assign({}, options, {
        address
      })
    )
  );

  return forkJoin(eventLoaders$, flatten);
});

const getAddressEvents = curry(
  (
    provider: Provider,
    options: FilterObject
  ): Observable<BlockchainEvent[]> => {
    return new Observable(observer => {
      const allEvents = createWeb3(provider).eth.filter(options);
      allEvents.get((err, events: BlockchainEvent[]) => {
        if (err) {
          observer.error(err);
          return;
        }
        observer.next(events);
        observer.complete();
      });
      return () => allEvents.stopWatching(_ => {});
    });
  }
);
