import * as fromNetwork from "./reducers/network";
import * as fromContracts from "./reducers/contracts";
import * as fromAccounts from "./reducers/accounts";
import * as fromTransactions from "./reducers/transactions";
import * as fromBlocks from "./reducers/blocks";
import * as fromEvents from "./reducers/events";

import { State } from "./model";
import { createSelector, createStructuredSelector } from "reselect";
import { decodeLogs } from "../utils";
import { always } from "ramda";
import {
  TransactionWithHash,
  ConfirmedTransaction,
  FailedTransaction,
  ContractInfo,
  QueryArgs,
  QueryModel,
  InterfaceRef
} from "../model";
import * as Web3 from "web3";

export const { getNetworkId } = fromNetwork.getSelectors<State>(
  m => m.networkId
);

export const {
  getContractFromRef,
  getContractsFromRefs,
  getAllAbis,
  getContractsFromQueryModel,
  getHasContracts
} = fromContracts.getSelectors<State>(m => m.contracts);

export const { getActiveAccount } = fromAccounts.getSelectors<State>(
  m => m.accounts
);

export const { getTransactionByTx } = fromTransactions.getSelectors<State>(
  m => m.transactions
);

export const { getLatestBlock, getLatestBlockNumber } = fromBlocks.getSelectors<
  State
>(m => m.blocks);

export const {
  getAllEvents,
  getEventEntities,
  getFiltersNotQueriedForMany
} = fromEvents.getSelectors<State>(m => m.events);

export const getDefaultTxParams = createStructuredSelector({
  from: getActiveAccount,
  gas: always(600000)
});

export const getLogDecoder = createSelector(getAllAbis, abis =>
  decodeLogs(abis)
);
