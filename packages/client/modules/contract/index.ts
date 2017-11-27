import { Observable } from "rxjs/Observable";
import * as Web3 from "web3";
import {
  ObservableStore,
  State,
  getContractFromRef,
  getDefaultTxParams
} from "../../store";
import {
  mergeMap,
  first,
  withLatestFrom,
  map,
  mergeMapTo,
  combineLatest,
  filter
} from "rxjs/operators";
import { caseInsensitiveCompare } from "../../utils";
import { executeMethod } from "@eth-proxy/rx-web3";
import { ContractRef } from "../../model";

import {
  TransactionWithHash,
  FailedTransaction,
  ConfirmedTransaction
} from "../../model";
import { send, SendContext } from "./send";
import { zipObj } from "ramda";

export const process = (
  store: ObservableStore<State>,
  web3Proxy$: Observable<Web3>,
  adapters: { call; exec }
) => (contractRef: ContractRef) => (method: string) => (
  args: any,
  tx_params: any
) => {
  const contract$ = store
    .select(getContractFromRef(contractRef))
    .pipe(first(x => !!x));

  return contract$.pipe(
    combineLatest(web3Proxy$, store.select(getDefaultTxParams)),
    first(contextValues => contextValues.every(x => !!x)),
    mergeMap(contextValues => {
      const context = (zipObj(
        ["contract", "web3", "defaultTxParams"],
        contextValues
      ) as any) as SendContext;

      const methodAbi = context.contract.abi.find(
        x => x.name === method
      ) as Web3.FunctionDescription;
      if(!methodAbi) {
        throw Error(`Method '${method}' not found on '${context.contract.name}'`);
      }

      const type = methodAbi.constant ? "call" : "exec";

      return send(context, {
        contractRef,
        method,
        args,
        tx_params
      }).let(adapters[type]);
    })
  );
};

Observable.prototype.once = once;
Observable.prototype.on = on;

function once(type, fn) {
  return this.map(result => {
    return result.status === "pending" ? fn(result.data) : result;
  });
}

function on(type, fn) {
  return this.filter(next => {
    return !(next && next.status === "pending");
  }).map(next => {
    return next.status === "confirmed" ? fn(next.value) : next;
  });
}

export * from "./adapters";
