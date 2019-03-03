import {
  combineEpics,
  ActionsObservable,
  ofType,
  StateObservable
} from 'redux-observable';
import { EpicContext } from '../context';
import { State } from './model';

import * as fromEvents from '../modules/events';
import * as fromTransactions from '../modules/transaction';
import { takeUntil, mergeMapTo, first } from 'rxjs/operators';
import * as fromLifecycle from '../modules/lifecycle';

export const rootEpic = (
  action$: ActionsObservable<any>,
  state: StateObservable<State>,
  dependencies: EpicContext
) => {
  const epic$ = combineEpics(
    fromEvents.queryEventsEpic,
    fromEvents.watchEvents,
    fromEvents.composeQueries,
    fromTransactions.processTransactionEpic,
    fromTransactions.findReceiptEpic
  )(action$, state, dependencies);

  return action$.pipe(
    ofType(fromLifecycle.ETH_PROXY_STARTED),
    first(),
    mergeMapTo(epic$),
    takeUntil(action$.pipe(ofType(fromLifecycle.ETH_PROXY_STOPPED)))
  );
};
