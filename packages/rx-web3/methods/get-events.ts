import * as Web3 from 'web3';
import { createWeb3 } from '../utils';
import { CurriedFunction2, curry } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { flatten } from 'ramda';

// TESTRPC WATCH DOES NOT WORK WITH ADDRESS LIST
export const getEvents = curry(
  (provider: Web3.Provider, options: Web3.FilterObject) => {
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
  }
);

const getAddressEvents = curry(
  (
    provider: Web3.Provider,
    options: Web3.FilterObject
  ): Observable<Web3.SolidityEvent<any>[]> => {
    return new Observable(observer => {
      const allEvents = createWeb3(provider).eth.filter(options);
      allEvents.get((err, event) => {
        if (err) {
          observer.error(err);
          return;
        }
        observer.next(event);
        observer.complete();
      });
      return () => allEvents.stopWatching(_ => {});
    });
  }
);
