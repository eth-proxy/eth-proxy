import * as Web3 from 'web3';
import { Observable } from 'rxjs/Observable';
import { map, concat, mergeMap, distinctUntilKeyChanged } from 'rxjs/operators';
import { head, curry, flatten, clone, evolve } from 'ramda';
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback';
import { merge } from 'rxjs/observable/merge';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { BigNumber } from 'bignumber.js';
import { CurriedFunction2, CurriedFunction3 } from 'ramda';

export function getNetwork(web3: Web3): Observable<string> {
  return bindNodeCallback<string>(web3.version.getNetwork.bind(web3))();
}

export const executeMethod = curry(
  <T>(web3Method: any, args = [], tx_params) => {
    return bindNodeCallback<T>(web3Method)(...clone(args), clone(tx_params));
  }
);
// It should be probably done by web3, same way like rest of receipt, but as for (0.20.3) its not done
const decodeStatus = (status: string) =>
  new Web3().toBigNumber(status.replace(/^0x/, '')).toNumber();

export function getReceipt(web3: Web3, tx): Observable<any> {
  return Observable.create(observer => {
    web3.eth.getTransactionReceipt(tx, (err, receipt) => {
      if (err || !receipt) {
        observer.error(err);
        return;
      }
      observer.next(evolve({ status: decodeStatus }, receipt));
      observer.complete();
    });
  });
}

export function getDefaultAccount(web3) {
  const callback = web3.eth.getAccounts.bind(web3) as (
    callback: (err: Error | null, value: string[]) => void
  ) => void;

  return bindNodeCallback(callback)().pipe(map(value => head(value)));
}

export function getBalance(account: string) {
  return web3 => {
    const callback = web3.eth.getBalance.bind(web3) as (
      x: string,
      callback: (err: Error | null, value: any) => void
    ) => void;

    return bindNodeCallback(callback)(account).pipe(
      map(wei => new Web3().fromWei(wei, 'ether'))
    );
  };
}

export function getLatestBlockHash(web3): Observable<string> {
  return Observable.create(observer => {
    const filter = web3.eth.filter('latest');
    filter.watch((err, blockHash) => {
      if (err) {
        observer.error(err);
      } else {
        observer.next(blockHash);
      }
    });
    return () => filter.stopWatching(_ => {});
  });
}

export function getLatestBlock(web3): Observable<Web3.Block> {
  return getBlock('latest')(web3).pipe(
    concat(
      getLatestBlockHash(web3).pipe(mergeMap(hash => getBlock(hash)(web3)))
    ),
    distinctUntilKeyChanged('hash')
  );
}

export function getBlock(blockHashOrNumber: 'latest' | string | number) {
  return (web3): Observable<any> =>
    Observable.create(observer => {
      web3.eth.getBlock(blockHashOrNumber, (err, block) => {
        if (err) {
          observer.error(err);
        } else if (!block) {
          observer.error('Invalid block');
        } else {
          observer.next(block);
          observer.complete();
        }
      });
    });
}

export const getEvents = curry((web3: Web3, options: Web3.FilterObject) => {
  const addressList = Array.isArray(options.address)
    ? options.address
    : [options.address];

  const eventLoader = getAddressEvents(web3);

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
  (web3: Web3, options: Web3.FilterObject): Observable<any> => {
    return new Observable(observer => {
      const allEvents = web3.eth.filter(options);
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

// NATIVE WATCH DOES NOT WORK WITH ADDRESS LIST
export function watchEvents(web3: Web3, options: Web3.FilterObject) {
  const addressList = Array.isArray(options.address)
    ? options.address
    : [options.address];

  const nativeWatch = watchAddressEvents(web3);

  const watches$ = addressList.map(address =>
    nativeWatch(
      Object.assign({}, options, {
        address
      })
    )
  );

  return merge(...watches$);
}

const watchAddressEvents = curry(
  (web3: Web3, options: Web3.FilterObject): Observable<any> => {
    return new Observable(observer => {
      const allEvents = web3.eth.filter(options);
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
