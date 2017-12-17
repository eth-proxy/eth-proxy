import { first, tap, mergeMap, filter, map } from "rxjs/operators";

import { RequestSpec } from "../model";
import {
  ObservableStore,
  State,
  getContractFromRef$,
  createProcessCall,
  getRequestById
} from "../../../store";
import { pickTxParamsProps } from "../utils";

import { Observable } from "rxjs/Observable";

export function processCall(
  store: ObservableStore<State>,
  genId: () => string
) {
  // user input
  return (transactionDef: RequestSpec<any, any, any>) => {
    const id = genId();    
    const { address, method, payload } = transactionDef;
    return store.let(getContractFromRef$(transactionDef)).pipe(
      first(),
      tap(contract => {
        store.dispatch(
          createProcessCall({
            id,
            abi: contract.abi,
            address: address || contract.address,
            args: payload,
            contractName: transactionDef.interface,
            method,
            txParams: pickTxParamsProps(transactionDef)
          })
        );
      }),
      mergeMap(() => {
        return store.select(getRequestById(id)).pipe(
          tap(({ status, err }) => {
            if (status === "failed") {
              throw Error(err);
            }
          }),
          first(x => x.status === "success"),
          map(({ data }) => data)
        );
      })
    );
  };
}
