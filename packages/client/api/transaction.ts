import { combineLatest, defer } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

import { getTransactionResultFromInitId$ } from '../store';
import { Request } from '../modules/request';
import * as fromTx from '../modules/transaction';
import { Context } from '../context';
import { getDefaultAccount } from '@eth-proxy/rpc';

export function sendTransaction({ genId, store, provider }: Context) {
  return (request: Request<any, any, any>) => {
    const txParams$ = getDefaultAccount(provider).then(account =>
      fromTx.mergeParams(request, { from: account })
    );

    return combineLatest(
      defer(() => Promise.resolve().then(genId)),
      txParams$
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
      )
    );
  };
}
