import { createSelector, createStructuredSelector } from 'reselect';
import { always, keys, pick, values, map } from 'ramda';
import { Block } from '@eth-proxy/rx-web3';

import * as fromAccounts from '../modules/account';
import * as fromEvents from '../modules/events';
import * as fromSchema from '../modules/schema';
import * as fromCalls from '../modules/call';
import * as fromBlocks from '../modules/blocks';
import * as fromNetwork from '../modules/network';
import * as fromTransactions from '../modules/transaction';

import { State } from './model';
import { DEFAULT_GAS } from '../constants';

export const getDefaultTxParams = createStructuredSelector({
  from: fromAccounts.getActiveAccount,
  gas: always(DEFAULT_GAS)
});

export const getSelectors = <T>(getModule: (state: T) => State) =>
  fromSchema.getSelectors(
    createSelector(getModule, m => m[fromSchema.moduleId])
  );

const getModelAddressess = (id: string) =>
  createSelector(
    fromEvents.getModelFromId(id),
    fromSchema.getContractsByName,
    (model, contractsByName) =>
      keys(model.deps).map(
        k => contractsByName[k] && contractsByName[k].address
      )
  );

export const getQueryResultsFromModelId = (id: string) =>
  createSelector(
    getModelAddressess(id),
    fromEvents.getQueryResultsByAddress,
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

export const getContractsFromQueryModel = (userModel: fromEvents.QueryModel) =>
  createSelector(fromSchema.getContractForRef, contractsFromRefs =>
    map(contractsFromRefs, keys(userModel.deps))
  );
