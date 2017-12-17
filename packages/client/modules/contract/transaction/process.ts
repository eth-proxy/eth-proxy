import { first, tap, mergeMapTo } from "rxjs/operators";
import { combineLatest } from "rxjs/observable/combineLatest";
import { Observable } from "rxjs/Observable";

import { prepareTxParams } from "./params";
import { Request } from "../model";
import {
  ObservableStore,
  State,
  getContractFromRef$,
  createProcessTransaction,
  getTransactionFromInitId,
  getTransactionResultFromInitId$
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
  // user input
  return (request: Request<any, any, any>) => {
    const initId = genId();

    const { address, method, payload } = request;
    return combineLatest(
      store.let(getContractFromRef$(request)),
      getParams(request)
    ).pipe(
      first(),
      tap(([contract, txParams]) => {
        store.dispatch(
          createProcessTransaction({
            contractName: request.interface,
            address: address || contract.address,
            method,
            txParams,
            args: payload,
            initId,
            abi: contract.abi
          })
        );
      }),
      mergeMapTo(store.let(getTransactionResultFromInitId$(initId)))
    );
  };
}
