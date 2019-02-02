import { ActionsObservable, StateObservable } from 'redux-observable';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of, throwError as _throw } from 'rxjs';
import { decodeLogs, findReceipt } from '@eth-proxy/rpc';

import * as actions from '../actions';
import { EpicContext } from 'client/context';
import { State } from 'client/store';
import { ofType } from 'client/utils';
import * as fromSchema from '../../schema';

export const findReceiptEpic = (
  actions$: ActionsObservable<actions.TxGenerated>,
  state$: StateObservable<State>,
  { provider }: EpicContext
) => {
  return actions$.pipe(
    ofType(actions.TX_GENERATED),
    withLatestFrom(state$),
    mergeMap(([{ payload: { tx } }, state]) =>
      findReceipt(provider, tx).pipe(
        map(receipt => {
          const logs = decodeLogs(fromSchema.getAllAbis(state))(receipt.logs);
          return actions.createLoadReceiptSuccess({
            receipt,
            logs
          });
        }),
        catchError(err => of(actions.createGetReceiptFailed(tx, err)))
      )
    )
  );
};
