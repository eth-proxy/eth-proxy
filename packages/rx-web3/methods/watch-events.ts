import * as Web3 from 'web3';
import { CurriedFunction2, curry } from 'ramda';
import { Observable, merge } from 'rxjs';
import { Provider, FilterObject, BlockchainEvent, Log } from '../interfaces';
import { arrify } from '../utils';

// TESTRPC WATCH DOES NOT WORK WITH ADDRESS LIST
export const watchEvents = curry(
  (provider: Provider, options: FilterObject) => {
    const watches$ = arrify(options.address).map(address => {
      return watchAddressEvents(provider)(
        Object.assign({}, options, {
          address
        })
      );
    });

    return merge(...watches$);
  }
);

const watchAddressEvents = curry(
  (provider: Provider, options: FilterObject): Observable<Log> => {
    return new Observable(observer => {
      const allEvents = new Web3(provider).eth.filter(options);
      allEvents.watch((err, event) => {
        if (err) {
          observer.error(err);
          return;
        }
        observer.next((event as any) as Log);
      });
      return () => allEvents.stopWatching(_ => {});
    });
  }
);
