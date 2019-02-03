import { first, tap, mergeMap, map } from 'rxjs/operators';
import { defer } from 'rxjs';

import { Request, omitCustomProps } from '../modules/request';
import { createProcessCall, getRequestById } from '../modules/call';
import { Context } from '../context';

export function sendCall({ genId, store }: Context) {
  return (request: Request<string, string, any>) => {
    return defer(() => Promise.resolve().then(genId)).pipe(
      tap(id => {
        const { address, method, payload } = request;
        store.dispatch(
          createProcessCall({
            id,
            address,
            args: payload,
            contractName: request.interface,
            method,
            txParams: omitCustomProps(request)
          })
        );
      }),
      mergeMap(id => {
        return store.select(getRequestById(id)).pipe(
          tap(({ status, err }) => {
            if (status === 'failed') {
              throw err;
            }
          }),
          first(x => x.status === 'success'),
          map(({ data }) => data)
        );
      })
    );
  };
}
