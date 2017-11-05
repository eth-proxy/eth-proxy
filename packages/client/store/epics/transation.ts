import {
  TransactionConfirmed,
  TransactionTypes,
  createTransactionFailed,
  createTransactionConfirmed,
  TX_GENERATED
} from "../actions";
import { ActionsObservable } from "redux-observable";
import { mergeMap, retryWhen, delay, take, concat, map, withLatestFrom } from "rxjs/operators";
import { getReceipt } from "@eth-proxy/rx-web3";
import { Observable } from "rxjs/Observable";
import { getLogDecoder } from "../selectors";
import "rxjs/add/Observable/of";
import { EpicContext, State } from "../model";

export const findReceiptEpic = (
  actions$: ActionsObservable<any>,
  store,
  { web3Proxy$ }: EpicContext
) => {
  return actions$.ofType(TX_GENERATED).pipe(
    withLatestFrom(web3Proxy$),
    mergeMap(([{ payload: { tx } }, web3 ]) =>
      getReceipt(web3, tx).pipe(
        map(receipt =>
          createTransactionConfirmed({
            receipt,
            logs: getLogDecoder(store.getState())(receipt.logs)
          })
        ),
        retryWhen(err =>
          err.pipe(
            delay(1000),
            take(24),
            concat(_ =>
              Observable.of(
                createTransactionFailed(
                  "Transaction was not processed within 240s",
                  tx
                )
              )
            )
          )
        )
      )
    )
  );
};
