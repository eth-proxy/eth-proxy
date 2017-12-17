import {
  createProcessTransactionFailed,
  PROCESS_TRANSACTION,
  ProcessTransaction,
  createTxGenerated
} from "../actions";
import { ActionsObservable } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { EpicContext } from "../model";
import { of } from "rxjs/observable/of";

import { Observable } from "rxjs/Observable";
import { TxGenerated, ProcessTransactionFailed } from "../actions";

export const processTransactionEpic = (
  actions$: ActionsObservable<any>,
  _,
  { processTransaction }: EpicContext
) => {
  return actions$.ofType(PROCESS_TRANSACTION).pipe(
    mergeMap(({ payload }: ProcessTransaction) => {
      return processTransaction(payload).pipe(
        map(createTxGenerated(payload.initId)),
        catchError(err => {
          return of(
            createProcessTransactionFailed({
              initId: payload.initId,
              err
            })
          );
        })
      );
    })
  );
};
