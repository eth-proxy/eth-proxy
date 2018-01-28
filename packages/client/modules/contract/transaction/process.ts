import { tap, mergeMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { defer } from 'rxjs/observable/defer';

import { prepareTxParams } from './params';
import {
  ObservableStore,
  State,
  createProcessTransaction,
  getTransactionResultFromInitId$,
  ConfirmedTransaction,
  FailedTransaction,
  InitializedTransaction,
  TransactionWithHash,
  Request
} from '../../../store';

import { Observable } from 'rxjs/Observable';

export function processTransaction(
  store: ObservableStore<State>,
  genId: () => string
) {
  const getParams = prepareTxParams(store);

  return (request: Request<any, any, any>) => {
    return combineLatest(
      defer(() => Promise.resolve().then(genId)),
      getParams(request)
    ).pipe(
      tap(([initId, txParams]) => {
        const { address, method, payload } = request;
        store.dispatch(
          createProcessTransaction({
            contractName: request.interface,
            address,
            method,
            txParams,
            args: payload,
            initId
          })
        );
      }),
      mergeMap(([initId]) => store.let(getTransactionResultFromInitId$(initId)))
    );
  };
}
