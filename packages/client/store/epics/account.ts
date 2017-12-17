import { Observable } from 'rxjs/Observable';
import {
  mergeMapTo,
  mergeMap,
  distinctUntilChanged,
  map
} from 'rxjs/operators';
import { ActionsObservable } from 'redux-observable';
import { timer } from 'rxjs/observable/timer';

import { getDefaultAccount } from '@eth-proxy/rx-web3';
import { createSetActiveAccount } from '../actions';
import { EpicContext } from '../model';

export const watchAccount = (
  _: ActionsObservable<any>,
  store,
  { web3Proxy$, options }: EpicContext
) => {
  return timer(0, options.pollInterval).pipe(
    mergeMapTo(web3Proxy$),
    mergeMap(getDefaultAccount),
    distinctUntilChanged(),
    map(createSetActiveAccount)
  );
};
