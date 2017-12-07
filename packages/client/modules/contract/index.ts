import { Observable } from "rxjs/Observable";
import * as Web3 from "web3";
import {
  ObservableStore,
  State,
  getContractFromRef,
  getDefaultTxParams
} from "../../store";
import { mergeMap, first, filter } from "rxjs/operators";
import { ContractRef } from "../../model";
import { send, SendContext } from "./send";
import { zipObj, curry } from "ramda";
import { combineLatest } from "rxjs/observable/combineLatest";
import { of } from "rxjs/observable/of";

const areParamsValid = curry((type: string, params: any) => {
  return !(type === "exec" && !params.from);
});

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
    mergeMap(contract => {
      const methodAbi = contract.abi.find(
        x => x.name === method
      ) as Web3.FunctionDescription;
      if (!methodAbi) {
        throw Error(`Method '${method}' not found on '${contract.name}'`);
      }
      const type = methodAbi.constant ? "call" : "exec";

      return combineLatest(
        of(contract),
        of(adapters[type]),
        web3Proxy$,
        store.select(getDefaultTxParams).let(filter(areParamsValid(type)))
      ).pipe(first((contextValues: any) => contextValues.every(x => !!x)));
    }),
    mergeMap(contextValues => {
      const context = (zipObj(
        ["contract", "adapter", "web3", "defaultTxParams"],
        contextValues
      ) as any) as SendContext;

      return send(context, {
        contractRef,
        method,
        args,
        tx_params
      }).let(context.adapter);
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
    return next.status === "confirmed" ? fn(next) : next;
  });
}

export * from "./adapters";
