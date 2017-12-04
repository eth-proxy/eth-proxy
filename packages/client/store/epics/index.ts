import { combineEpics } from "redux-observable";
import { findReceiptEpic } from "./transation";
import { watchAccount } from "./account";
import { watchLatestBlock } from "./blocks";
import { queryEvents } from './query-events'
import { watchEvents } from './watch-events';

import { EpicContext } from "../model";
import { Epic } from "redux-observable";

export const rootEpic = combineEpics(
  findReceiptEpic,
  watchAccount,
  watchLatestBlock,
  queryEvents,
  watchEvents
);
