import * as Web3 from 'web3';
import { createWeb3 } from '../utils';
import { CurriedFunction2, curry } from 'ramda';
import { Observable, merge } from 'rxjs';

// TESTRPC WATCH DOES NOT WORK WITH ADDRESS LIST
export const watchEvents = curry(
  (provider: Web3.Provider, options: Web3.FilterObject) => {
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
  (
    provider: Web3.Provider,
    options: Web3.FilterObject
  ): Observable<Web3.SolidityEvent<any>> => {
    return new Observable(observer => {
      const allEvents = createWeb3(provider).eth.filter(options);
      allEvents.watch((err, event) => {
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
