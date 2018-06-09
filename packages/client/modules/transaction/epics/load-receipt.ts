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
  catchError,
  withLatestFrom
} from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import * as actions from '../actions';
import { Observable } from 'rxjs/Observable';
import { EpicContext } from '../../../context';
import { getLogDecoder } from '../../schema';

export const findReceiptEpic = (
  actions$: ActionsObservable<actions.TxGenerated>,
  _,
  { getReceipt, state$ }: EpicContext
) => {
  return actions$.pipe(
    ofType(TX_GENERATED),
    withLatestFrom(state$),
    mergeMap(([{ payload: { tx } }, state]) =>
      getReceipt(tx).pipe(
        map(receipt => {
          const logs = getLogDecoder(state)(receipt.logs);
          return createLoadReceiptSuccess({
            receipt,
            logs
          });
        }),
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
