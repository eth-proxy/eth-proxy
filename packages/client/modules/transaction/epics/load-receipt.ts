import {
  createGetReceiptFailed,
  createLoadReceiptSuccess,
  TX_GENERATED
} from '../actions';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import {
  mergeMap,
  retryWhen,
  delay,
  take,
  concat,
  map,
  catchError,
  withLatestFrom,
  tap
} from 'rxjs/operators';
import { of, throwError as _throw, defer } from 'rxjs';
import { getReceipt, TransactionReceipt } from '@eth-proxy/rpc';

import * as actions from '../actions';
import { EpicContext } from '../../../context';
import { getLogDecoder } from '../../schema';
import { State } from '../../../store';
import { isNil } from 'ramda';

export const findReceiptEpic = (
  actions$: ActionsObservable<actions.TxGenerated>,
  state$: StateObservable<State>,
  { provider }: EpicContext
) => {
  return actions$.pipe(
    ofType(TX_GENERATED),
    withLatestFrom(state$),
    mergeMap(([{ payload: { tx } }, state]) =>
      defer(() => getReceipt(provider, tx)).pipe(
        tap(throwIfEmpty),
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

function throwIfEmpty(receipt: TransactionReceipt | null) {
  if (isNil(receipt)) {
    throw Error('Receipt not found');
  }
}
