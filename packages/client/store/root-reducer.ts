import * as fromNetwork from "./reducers/network";
import * as fromContracts from "./reducers/contracts";
import * as fromAccounts from "./reducers/accounts";
import * as fromTransactions from "./reducers/transactions";
import * as fromBlocks from "./reducers/blocks";
import * as fromEvents from "./reducers/events";

import { combineReducers, AnyAction } from "redux";

import { State } from "./model";

export const reducer = combineReducers<State>({
  networkId: fromNetwork.reducer,
  contracts: fromContracts.reducer,
  accounts: fromAccounts.reducer,
  transactions: fromTransactions.reducer,
  blocks: fromBlocks.reducer,
  events: fromEvents.reducer
});