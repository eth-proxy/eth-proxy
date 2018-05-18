import { Observable } from 'rxjs/Observable';
import { mergeMap, distinctUntilChanged, map } from 'rxjs/operators';
import { ActionsObservable } from 'redux-observable';
import { timer } from 'rxjs/observable/timer';

import { createSetActiveAccount } from '../actions';
import { EpicContext } from '../model';

export const watchAccount = (
  _: ActionsObservable<any>,
  __,
  { getDefaultAccount, options }: EpicContext
) => {
  return timer(0, options.pollInterval).pipe(
    mergeMap(getDefaultAccount),
    distinctUntilChanged(),
    map(createSetActiveAccount)
  );
};
