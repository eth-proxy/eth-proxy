import { Observable } from 'rxjs';
import {
  combineEpics,
  ActionsObservable,
  Epic,
  ofType,
  StateObservable
} from 'redux-observable';
import { EpicContext } from '../context';
import { State } from './model';

import * as fromAccounts from '../modules/account';
import * as fromBlocks from '../modules/blocks';
import * as fromNetwork from '../modules/network';
import * as fromEvents from '../modules/events';
import * as fromSchema from '../modules/schema';
import * as fromTransactions from '../modules/transaction';
import * as fromCalls from '../modules/call';
import { takeUntil, mergeMapTo, first } from 'rxjs/operators';
import * as fromLifecycle from '../modules/lifecycle';

export const rootEpic = (
  action$: ActionsObservable<any>,
  state: StateObservable<State>,
  dependencies: EpicContext
) => {
  const epic$ = combineEpics(
    fromNetwork.loadNetwork,
    fromAccounts.watchAccount,
    fromBlocks.loadLatestBlock,
    fromBlocks.loadBlock,
    fromBlocks.watchNewBlocks,
    fromEvents.queryEventsEpic,
    fromEvents.watchEvents,
    fromEvents.composeQueries,
    fromSchema.loadContractSchema,
    fromTransactions.processTransactionEpic,
    fromTransactions.findReceiptEpic,
    fromCalls.processCallEpic
  )(action$, state, dependencies);

  return action$.pipe(
    ofType(fromLifecycle.ETH_PROXY_STARTED),
    first(),
    mergeMapTo(epic$),
    takeUntil(action$.pipe(ofType(fromLifecycle.ETH_PROXY_STOPPED)))
  );
};
