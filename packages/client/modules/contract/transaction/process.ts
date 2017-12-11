import { first, tap, mergeMapTo } from "rxjs/operators";
import { combineLatest } from "rxjs/observable/combineLatest";
import { Observable } from "rxjs/Observable";

import { prepareTxParams } from "./params";
import { RequestSpec } from "../model";
import {
  ObservableStore,
  State,
  getContractFromRef$,
  createProcessTransaction,
  getTransactionFromInitId
} from "../../../store";
import {
  ConfirmedTransaction,
  FailedTransaction,
  InitializedTransaction,
  TransactionWithHash
} from "../../../model";

export function processTransaction(
  store: ObservableStore<State>,
  genId: () => string
) {
  // inject dependencies
  const getParams = prepareTxParams(store);
  const initId = genId();
  // user input
  return (transactionDef: RequestSpec<any, any, any>) => {
    const { address, method, payload } = transactionDef;
    return combineLatest(
      store.let(getContractFromRef$(transactionDef)),
      getParams(transactionDef)
    ).pipe(
      first(),
      tap(([contract, txParams]) => {
        store.dispatch(
          createProcessTransaction({
            contractName: transactionDef.interface,
            address: address || contract.address,
            method,
            txParams,
            args: payload,
            initId,
            abi: contract.abi
          })
        );
      }),
      mergeMapTo(store.select(getTransactionFromInitId(initId)))
    );
  };
}
