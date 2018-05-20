import { tap, mergeMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { defer } from 'rxjs/observable/defer';

import { prepareTxParams } from './params';
import {
  ObservableStore,
  State,
  getTransactionResultFromInitId$
} from '../../store';
import { Request } from '../request';
import * as actions from './actions';
import * as model from './model';

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
          actions.createProcessTransaction({
            contractName: request.interface,
            address,
            method,
            txParams,
            args: payload,
            initId
          })
        );
      }),
      mergeMap(([initId]) =>
        store.pipe(getTransactionResultFromInitId$(initId))
      )
    );
  };
}
