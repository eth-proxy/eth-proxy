import {
  createTransactionFailed,
  createTransactionConfirmed,
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
  withLatestFrom,
  catchError
} from 'rxjs/operators';
import { getReceipt } from '@eth-proxy/rx-web3';
import { getLogDecoder } from '../selectors';
import { EpicContext } from '../model';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import { TransactionConfirmed, TransactionFailed } from '../actions';
import { Observable } from 'rxjs/Observable';

export const findReceiptEpic = (
  actions$: ActionsObservable<any>,
  store,
  { web3Proxy$ }: EpicContext
) => {
  return actions$.pipe(
    ofType(TX_GENERATED),
    withLatestFrom(web3Proxy$),
    mergeMap(([{ payload: { tx } }, web3]) =>
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
            take(720),
            concat(_throw('Transaction was not processed within 720s'))
          )
        ),
        catchError(err => of(createTransactionFailed(tx, err)))
      )
    )
  );
};
