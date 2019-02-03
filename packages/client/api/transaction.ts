import { combineLatest, defer } from 'rxjs';
import { tap, mergeMap, map, first } from 'rxjs/operators';

import { getTransactionResultFromInitId$ } from '../store';
import { Request } from '../modules/request';
import * as fromTx from '../modules/transaction';
import * as fromAccount from '../modules/account';
import { Context } from '../context';

export function sendTransaction({ genId, store }: Context) {
  return (request: Request<any, any, any>) => {
    const txParams$ = store.select(fromAccount.getActiveAccount).pipe(
      map(account => {
        return fromTx.mergeParams(request, { from: account });
      }),
      first(fromTx.txParamsValid)
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
