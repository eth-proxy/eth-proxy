import { Observable, timer } from 'rxjs';
import { mergeMap, distinctUntilChanged, map } from 'rxjs/operators';
import { ActionsObservable } from 'redux-observable';

import * as actions from './actions';
import { EpicContext } from '../../context';
import { getDefaultAccount } from '@eth-proxy/rx-web3';

export const watchAccount = (
  _: ActionsObservable<actions.Types>,
  __,
  { options, rpc }: EpicContext
): Observable<any> => {
  return options.watchAccountTimer.pipe(
    mergeMap(() => rpc(getDefaultAccount)),
    distinctUntilChanged(),
    map(actions.createSetActiveAccount)
  );
};
