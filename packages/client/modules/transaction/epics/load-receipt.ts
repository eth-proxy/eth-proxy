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
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import * as actions from '../actions';
import { Observable } from 'rxjs/Observable';
import { EpicContext } from '../../../context';
import { getLogDecoder, State } from '../../../store';
import { Store } from 'redux';

export const findReceiptEpic = (
  actions$: ActionsObservable<actions.TxGenerated>,
  store: Store<State>,
  { getReceipt }: EpicContext
) => {
  return actions$.pipe(
    ofType(TX_GENERATED),
    mergeMap(({ payload: { tx } }) =>
      getReceipt(tx).pipe(
        map(receipt => {
          const logs = getLogDecoder(store.getState())(receipt.logs);
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
