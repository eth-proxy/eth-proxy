import { createSelector, createStructuredSelector } from 'reselect';
import { always } from 'ramda';
import * as Web3 from 'web3';

import * as fromNetwork from './reducers/network';
import * as fromContracts from './reducers/contracts';
import * as fromAccounts from './reducers/accounts';
import * as fromTransactions from './reducers/transactions';
import * as fromBlocks from './reducers/blocks';
import * as fromEvents from './reducers/events';
import * as fromCalls from './reducers/calls';
import {
  TransactionWithHash,
  ConfirmedTransaction,
  FailedTransaction,
  ContractInfo,
  QueryArgs,
  QueryModel,
  InterfaceRef,
  InitializedTransaction,
  EventMetadata,
  BlockchainEvent
} from '../model';
import { State } from './model';
import { decodeLogs } from '../utils';
import { DEFAULT_GAS } from './constants';

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

export const {
  getTransactionByTx,
  getTransactionFromInitId
} = fromTransactions.getSelectors<State>(m => m.transactions);

export const { getRequestById } = fromCalls.getSelectors<State>(m => m.calls);

export const {
  getLatestBlock,
  getLatestBlockNumberOrFail
} = fromBlocks.getSelectors<State>(m => m.blocks);

export const {
  getAllEvents,
  getEventEntities,
  getEventQueries,
  getQueryResultFromAddresses
} = fromEvents.getSelectors<State>(m => m.events);

export const getDefaultTxParams = createStructuredSelector({
  from: getActiveAccount,
  gas: always(DEFAULT_GAS)
});

export const getLogDecoder = createSelector(getAllAbis, abis =>
  decodeLogs(abis)
);
