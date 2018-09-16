import { createWeb3 } from '../utils';
import { CurriedFunction2, curry } from 'ramda';
import { Observable, merge } from 'rxjs';
import { Provider, FilterObject, BlockchainEvent } from '../interfaces';

// TESTRPC WATCH DOES NOT WORK WITH ADDRESS LIST
export const watchEvents = curry(
  (provider: Provider, options: FilterObject) => {
    const addressList = Array.isArray(options.address)
      ? options.address
      : [options.address];

    const nativeWatch = watchAddressEvents(provider);

    const watches$ = addressList.map(address =>
      nativeWatch(
        Object.assign({}, options, {
          address
        })
      )
    );

    return merge(...watches$);
  }
);

const watchAddressEvents = curry(
  (provider: Provider, options: FilterObject): Observable<BlockchainEvent> => {
    return new Observable(observer => {
      const allEvents = createWeb3(provider).eth.filter(options);
      allEvents.watch((err, event: BlockchainEvent) => {
        if (err) {
          observer.error(err);
          return;
        }
        observer.next(event);
      });
      return () => allEvents.stopWatching(_ => {});
    });
  }
);
