import * as Web3 from 'web3';
import { createWeb3 } from '../utils';
import { curry } from 'ramda';
import { Observable } from 'rxjs';

export const watchEvents = curry(
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
