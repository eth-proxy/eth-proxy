import { Observable } from "rxjs/Observable";
import * as Web3 from "web3";
import {
  ObservableStore,
  State,
  getTransactionByTx,
  createTxGenerated,
  createTransactionFailed
} from "../store";
import { mergeMap, tap, map } from "rxjs/operators";
import { send } from "./send";
import { Transaction, ContractRef } from "../model";

export const exec = (
  store: ObservableStore<State>,
  web3Proxy$: Observable<Web3>
) => (
  contractRef: ContractRef,
  method: string,
  args: any,
  tx_params: any
): Observable<Transaction> => {
  return send<string>(store, web3Proxy$)(
    contractRef,
    method,
    args,
    tx_params
  ).pipe(
    map(res => ({ ...res, tx: res.data })),
    tap(result => store.dispatch(createTxGenerated(result))),
    mergeMap(({ tx }) => store.select(getTransactionByTx(tx)))
  );
};

Observable.prototype.once = once;
Observable.prototype.on = on;

function once(type, fn) {
  return this.map(function(result) {
    return result.status === 'pending' ? fn(result.data) : result;
  });
}

function on(type, fn) {
  return this.filter(function(next) {
    return !(next && next.status === "pending");
  }).map(function(next) {
    if (next.status === "confirmed") {
      return fn(next.value);
    }
    if (next.status === 'failed') {
      throw Error(next.error);
    }
    return next;
  });
}