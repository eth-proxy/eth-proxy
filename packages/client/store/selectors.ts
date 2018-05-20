import { createSelector, createStructuredSelector } from 'reselect';
import { always, keys, pick, values, map } from 'ramda';
import { Block } from '@eth-proxy/rx-web3';

import * as fromAccounts from '../modules/account';
import * as fromBlocks from '../modules/blocks';
import * as fromNetwork from '../modules/network';
import * as fromEvents from '../modules/events';
import * as fromSchema from '../modules/schema';
import * as fromTransactions from '../modules/transaction';
import * as fromCalls from '../modules/call';

import { State } from './model';
import { decodeLogs } from '../utils';
import { DEFAULT_GAS } from '../constants';
import { QueryModel } from '../modules/events';

export const { getNetworkId } = fromNetwork.getSelectors<State>(
  m => m.networkId
);

export const {
  getContractFromRef,
  getContractsFromRefs,
  getAllAbis,
  getHasContracts,
  getContractsByName,
  getContractForRef
} = fromSchema.getSelectors<State>(m => m.contracts);

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
  fromSchema.getSelectors(createSelector(getModule, m => m.contracts));

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

export const getContractsFromQueryModel = (userModel: QueryModel) =>
  createSelector(getContractForRef, contractsFromRefs =>
    map(contractsFromRefs, keys(userModel.deps))
  );
