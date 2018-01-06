import { combineEpics } from 'redux-observable';
import { findReceiptEpic } from './transaction-receipt';
import { watchAccount } from './account';
import { watchLatestBlock } from './blocks';
import { queryEvents } from './query-events';
import { watchEvents } from './watch-events';
import { processTransactionEpic } from './process-transaction';
import { processCallEpic } from './process-call';

import { EpicContext } from '../model';
import { Epic } from 'redux-observable';

export const rootEpic = combineEpics(
  watchAccount,
  watchLatestBlock,
  queryEvents,
  watchEvents,
  processTransactionEpic,
  findReceiptEpic,
  processCallEpic
);
