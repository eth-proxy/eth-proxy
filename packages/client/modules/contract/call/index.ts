import { first, tap, mergeMap, filter, map } from 'rxjs/operators';

import { Request } from '../model';
import {
  ObservableStore,
  State,
  getContractFromRef$,
  createProcessCall,
  getRequestById
} from '../../../store';
import { pickTxParamsProps } from '../utils';

import { Observable } from 'rxjs/Observable';

export function processCall(
  store: ObservableStore<State>,
  genId: () => string
) {
  // user input
  return (request: Request<string, string, any>) => {
    const id = genId();
    const { address, method, payload } = request;
    return store.let(getContractFromRef$(request)).pipe(
      first(),
      tap(contract => {
        store.dispatch(
          createProcessCall({
            id,
            abi: contract.abi,
            address: address || contract.address,
            args: payload,
            contractName: request.interface,
            method,
            txParams: pickTxParamsProps(request)
          })
        );
      }),
      mergeMap(() => {
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
