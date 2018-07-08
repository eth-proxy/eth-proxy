import { Observable } from 'rxjs';
import { combineEpics, ActionsObservable, Epic } from 'redux-observable';
import { EpicContext } from '../context';
import { State } from './model';

import * as fromAccounts from '../modules/account';
import * as fromBlocks from '../modules/blocks';
import * as fromNetwork from '../modules/network';
import * as fromEvents from '../modules/events';
import * as fromSchema from '../modules/schema';
import * as fromTransactions from '../modules/transaction';
import * as fromCalls from '../modules/call';

export const rootEpic = combineEpics(
  fromNetwork.loadNetwork,
  fromAccounts.watchAccount,
  fromBlocks.watchLatestBlock,
  fromEvents.queryEventsEpic,
  fromEvents.watchEvents,
  fromEvents.composeQueries,
  fromSchema.loadContractSchema,
  fromTransactions.processTransactionEpic,
  fromTransactions.findReceiptEpic,
  fromCalls.processCallEpic
);
