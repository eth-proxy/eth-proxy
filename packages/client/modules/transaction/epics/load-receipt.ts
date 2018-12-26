import { ActionsObservable, StateObservable } from 'redux-observable';
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
import { of, throwError as _throw, defer } from 'rxjs';
import { getReceipt, decodeLogs } from '@eth-proxy/rpc';

import * as actions from '../actions';
import { EpicContext } from 'client/context';
import { State } from 'client/store';
import * as fromSchema from '../../schema';
import { ofType } from 'client/utils';

export const findReceiptEpic = (
  actions$: ActionsObservable<actions.TxGenerated>,
  state$: StateObservable<State>,
  { provider }: EpicContext
) => {
  return actions$.pipe(
    ofType(actions.TX_GENERATED),
    withLatestFrom(state$),
    mergeMap(([{ payload: { tx } }, state]) =>
      defer(() => getReceipt(provider, tx)).pipe(
        map(receipt => {
          const logs = decodeLogs(fromSchema.getAllAbis(state))(receipt.logs);
          return actions.createLoadReceiptSuccess({
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
        catchError(err => of(actions.createGetReceiptFailed(tx, err)))
      )
    )
  );
};
