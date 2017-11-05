import { Epic } from "redux-observable";
import { combineEpics } from "redux-observable";
import { findReceiptEpic } from "./transation";
import { watchAccount } from "./account";
import { watchLatestBlock } from "./blocks";

import {
  TransactionConfirmed,
  TX_GENERATED,
  TxGenerated,
  TransactionFailed
} from "../actions";
import { 
  EpicContext
} from '../model';

export const rootEpic = combineEpics(findReceiptEpic, watchAccount, watchLatestBlock);
