import { first, tap, mergeMap, map } from 'rxjs/operators';

import {
  ObservableStore,
  State,
  createProcessCall,
  getRequestById,
  Request
} from '../../../store';
import { pickTxParamsProps } from '../utils';

import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';

export function processCall(
  store: ObservableStore<State>,
  genId: () => string
) {
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
      })
    );
  };
}
