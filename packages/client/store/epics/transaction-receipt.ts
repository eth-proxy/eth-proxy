import {
  createGetReceiptFailed,
  createLoadReceiptSuccess,
  TX_GENERATED
} from '../actions';
import { ActionsObservable, ofType } from 'redux-observable';
import {
  mergeMap,
  retryWhen,
  delay,
  take,
  concat,
  map,
  catchError
} from 'rxjs/operators';
import { getLogDecoder } from '../selectors';
import { EpicContext } from '../model';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import * as actions from '../actions';
import { Observable } from 'rxjs/Observable';

export const findReceiptEpic = (
  actions$: ActionsObservable<actions.TxGenerated>,
  store,
  { getReceipt }: EpicContext
) => {
  return actions$.pipe(
    ofType(TX_GENERATED),
    mergeMap(({ payload: { tx } }) =>
      getReceipt(tx).pipe(
        map(receipt =>
          createLoadReceiptSuccess({
            receipt,
            logs: getLogDecoder(store.getState())(receipt.logs)
          })
        ),
        retryWhen(err =>
          err.pipe(
            delay(1000),
            take(720),
            concat(_throw('Transaction was not processed within 720s'))
          )
        ),
        catchError(err => of(createGetReceiptFailed(tx, err)))
      )
    )
  );
};
