import { Observable } from 'rxjs/Observable';
import { combineEpics, ActionsObservable, Epic } from 'redux-observable';

import { findReceiptEpic } from './transaction-receipt';
import { watchAccount } from './account';
import { watchLatestBlock } from './blocks';
import { queryEvents } from './query-events';
import { watchEvents } from './watch-events';
import { processTransactionEpic } from './process-transaction';
import { processCallEpic } from './process-call';
import { composeQueries } from './compose-queries';
import { loadContractSchema } from './contract-schema';
import * as model from '../model';

export const rootEpic = combineEpics(
  watchAccount,
  watchLatestBlock,
  queryEvents,
  watchEvents,
  processTransactionEpic,
  findReceiptEpic,
  processCallEpic,
  composeQueries,
  loadContractSchema
);
