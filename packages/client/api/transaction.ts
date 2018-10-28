import { combineLatest, defer } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

import { getTransactionResultFromInitId$, getTxParams } from '../store';
import { Request } from '../modules/request';
import * as fromTx from '../modules/transaction';
import { Context } from '../context';
import { getInterceptor } from '../utils';

export function sendTransaction({ genId, store, options }: Context) {
  return (request: Request<any, any, any>) => {
    return combineLatest(
      defer(() => Promise.resolve().then(genId)),
      store.pipe(getTxParams(request))
    ).pipe(
      tap(([initId, txParams]) => {
        const { address, method, payload } = request;
        store.dispatch(
          fromTx.createProcessTransaction({
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
      ),
      getInterceptor('transaction', options)
    );
  };
}
