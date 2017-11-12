import * as Web3 from "web3";
import { Observable } from "rxjs/Observable";
import { map, concat, mergeMap, distinctUntilKeyChanged } from "rxjs/operators";
import { head, curry, CurriedFunction2 } from "ramda";
import "rxjs/add/observable/bindNodeCallback";

export function getNetwork(web3: Web3): Observable<string> {
  return Observable.bindNodeCallback<string>(
    web3.version.getNetwork.bind(web3)
  )();
}

export function executeMethod<T>(web3Method: any, args = [], tx_params = {}) {
  return Observable.bindNodeCallback<T>(web3Method)(...args, tx_params);
}

export function getReceipt(web3: Web3, tx): Observable<any> {
  return Observable.create(observer => {
    web3.eth.getTransactionReceipt(tx, (err, receipt) => {
      if (err || !receipt) {
        observer.error(err);
        return;
      }
      observer.next(receipt);
      observer.complete();
    });
  });
}

export function getDefaultAccount(web3) {
  const callback = web3.eth.getAccounts.bind(web3) as (
    callback: (err: Error | null, value: string[]) => void
  ) => void;

  return Observable.bindNodeCallback(callback)().pipe(
    map(value => head(value))
  );
}

export function getBalance(account: string) {
  return web3 => {
    const callback = web3.eth.getBalance.bind(web3) as (
      x: string,
      callback: (err: Error | null, value: any) => void
    ) => void;

    return Observable.bindNodeCallback(callback)(account).pipe(
      map(wei => new Web3().fromWei(wei, "ether"))
    );
  };
}

export function getLatestBlockHash(web3): Observable<string> {
  return Observable.create(observer => {
    const filter = web3.eth.filter("latest");
    filter.watch((err, blockHash) => {
      if (err) {
        observer.error(err);
      } else {
        observer.next(blockHash);
      }
    });
    return () => filter.stopWatching();
  });
}

export function getLatestBlock(web3): Observable<Web3.Block> {
  return getBlock("latest")(web3).pipe(
    concat(
      getLatestBlockHash(web3).pipe(mergeMap(hash => getBlock(hash)(web3)))
    ),
    distinctUntilKeyChanged("hash")
  );
}

export function getBlock(blockHashOrNumber: "latest" | string | number) {
  return (web3): Observable<any> =>
    Observable.create(observer => {
      web3.eth.getBlock(blockHashOrNumber, (err, block) => {
        if (err || !block) {
          observer.error(err);
        } else {
          observer.next(block);
          observer.complete();
        }
      });
    });
}

export const getEvents = curry((web3: Web3, options: Web3.FilterObject) => {
  return new Observable<any[]>(observer => {
    const allEvents = web3.eth.filter(options);
    allEvents.get((err, events) => {
      if (err) {
        observer.error(err);
        return;
      }
      observer.next(events);
      observer.complete();
    });
    return () => allEvents.stopWatching();
  });
});

export function watchEvents(web3: Web3, options: Web3.FilterObject) {
  return new Observable(observer => {
    const allEvents = web3.eth.filter(options);
    allEvents.watch((err, event) => {
      if (err) {
        observer.error(err);
        return;
      }
      observer.next(event);
    });
    return () => allEvents.stopWatching();
  });
}
