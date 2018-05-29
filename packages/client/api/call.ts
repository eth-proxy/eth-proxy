import { first, tap, mergeMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { pickTxParamsProps, Request } from '../modules/request';
import { defer } from 'rxjs/observable/defer';
import { createProcessCall, getRequestById } from '../modules/call';
import { Context } from '../context';
import { getInterceptor } from '../utils';

export function sendCall({ genId, options, store }: Context) {
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
            txParams: pickTxParamsProps(request)
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
      }),
      getInterceptor('ethCall', options)
    );
  };
}
