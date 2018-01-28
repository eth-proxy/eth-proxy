import { createSelector, createStructuredSelector } from 'reselect';
import { always, keys, chain, reduce, pick, values } from 'ramda';
import * as Web3 from 'web3';

import * as fromNetwork from './reducers/network';
import * as fromContracts from './reducers/contracts';
import * as fromAccounts from './reducers/accounts';
import * as fromTransactions from './reducers/transactions';
import * as fromBlocks from './reducers/blocks';
import * as fromEvents from './reducers/events';
import * as fromCalls from './reducers/calls';

import { State } from './model';
import { decodeLogs } from '../utils';
import { DEFAULT_GAS } from './constants';
import {
  ContractInfo,
  ErrorRecord,
  InterfaceRef,
  LoadingRecord,
  QueryModel,
  FailedTransaction,
  ConfirmedTransaction,
  BlockchainEvent,
  InitializedTransaction,
  TransactionWithHash,
  AggregatedQueryResult,
  QueryArgs
} from './models';

export const { getNetworkId } = fromNetwork.getSelectors<State>(
  m => m.networkId
);

export const {
  getContractFromRef,
  getContractsFromRefs,
  getAllAbis,
  getContractsFromQueryModel,
  getHasContracts,
  getContractsByName
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
  getQueryResultsByAddress,
  getModelFromId,
  getIsLoadingByAddresses
} = fromEvents.getSelectors<State>(m => m.events);

export const getDefaultTxParams = createStructuredSelector({
  from: getActiveAccount,
  gas: always(DEFAULT_GAS)
});

export const getLogDecoder = createSelector(getAllAbis, abis =>
  decodeLogs(abis)
);

export const getSelectors = <T>(getModule: (state: T) => State) =>
  fromContracts.getSelectors(createSelector(getModule, m => m.contracts));

const getModelAddressess = (id: string) =>
  createSelector(
    getModelFromId(id),
    getContractsByName,
    (model, contractsByName) =>
      keys(model.deps).map(
        k => contractsByName[k] && contractsByName[k].address
      )
  );

export const getQueryResultsFromModelId = (id: string) =>
  createSelector(
    getModelAddressess(id),
    getQueryResultsByAddress,
    (addressess, getResulsByAddress) => {
      if (
        !addressess.every(address => address && !!getResulsByAddress[address])
      ) {
        return {
          failedQueries: [],
          events: [],
          loading: true
        };
      }
      const results = values(pick(addressess, getResulsByAddress));
      return {
        id,
        ...fromEvents.aggregateQueryResults(results)
      };
    }
  );
