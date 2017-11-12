import { Observable } from "rxjs/Observable";
import * as Web3 from "web3";
import {
  ObservableStore,
  State,
  getContractFromRef,
  getDefaultTxParams
} from "../store";
import { mergeMap, first, withLatestFrom, map } from "rxjs/operators";
import { caseInsensitiveCompare } from "../utils";
import { executeMethod } from "@eth-proxy/rx-web3";
import { ContractRef } from "../model";

export const send = <T>(
  store: ObservableStore<State>,
  web3Proxy$: Observable<Web3>
) => (contractRef: ContractRef, method: string, args: any, tx_params: any) => {
  const contract$ = store
    .select(getContractFromRef(contractRef))
    .pipe(first(x => !!x));

  return contract$.pipe(
    withLatestFrom(web3Proxy$),
    mergeMap(([{ abi, address }, web3]) => {
      const web3MethodRef = web3.eth.contract(abi).at(address)[method];

      const orderedArgs = Array.isArray(args)
        ? args
        : orderArgs(
            abi.find(({ name }) => caseInsensitiveCompare(name, method)).inputs,
            args
          );

      const txParams = {
        ...getDefaultTxParams(store.getState()),
        ...tx_params
      };

      return executeMethod<T>(web3MethodRef, orderedArgs, txParams).pipe(
        map(data => ({
          address,
          from: txParams.from,
          method,
          data
        }))
      );
    })
  );
};

function orderArgs(inputs: Web3.FunctionParameter[], args: any) {
  return inputs.map(({ name }) => {
    const arg = args[name] || args [omitPrefix('_', name)];
    if (!arg) {
      throw Error("Invalid Argument! " + name);
    }
    return arg;
  });
}

function omitPrefix(prefix: string, name: string) {
  return name.startsWith(prefix) ? name.substring(prefix.length) : name
}