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

export const rootEpic = (
  action$: ActionsObservable<any>,
  state: StateObservable<State>,
  dependencies: EpicContext
) => {
  return combineEpics(
    fromEvents.queryEventsEpic,
    fromEvents.watchEvents,
    fromEvents.composeQueries,
    fromTransactions.processTransactionEpic,
    fromTransactions.findReceiptEpic
  )(action$, state, dependencies);
};
