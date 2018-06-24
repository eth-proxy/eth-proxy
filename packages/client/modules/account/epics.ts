import { Observable, timer } from 'rxjs';
import { mergeMap, distinctUntilChanged, map } from 'rxjs/operators';
import { ActionsObservable } from 'redux-observable';

import * as actions from './actions';
import { EpicContext } from '../../context';

export const watchAccount = (
  _: ActionsObservable<actions.Types>,
  __,
  { getDefaultAccount, options }: EpicContext
): Observable<any> => {
  return timer(0, options.pollInterval).pipe(
    mergeMap(getDefaultAccount),
    distinctUntilChanged(),
    map(actions.createSetActiveAccount)
  );
};
