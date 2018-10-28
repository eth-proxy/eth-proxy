import { Observable } from 'rxjs';
import { distinctUntilChanged, map, mergeMapTo } from 'rxjs/operators';
import { ActionsObservable } from 'redux-observable';

import * as actions from './actions';
import { EpicContext } from '../../context';
import { getDefaultAccount } from '@eth-proxy/rpc';

export const watchAccount = (
  _: ActionsObservable<actions.Types>,
  __,
  { provider, options }: EpicContext
): Observable<any> => {
  return options.watchAccountTimer.pipe(
    mergeMapTo(getDefaultAccount(provider)),
    distinctUntilChanged(),
    map(actions.createSetActiveAccount)
  );
};
