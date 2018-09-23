import { createSelector, createStructuredSelector } from 'reselect';
import { always, keys, map } from 'ramda';

import * as fromAccounts from '../modules/account';
import * as fromEvents from '../modules/events';
import * as fromSchema from '../modules/schema';
import * as fromBlocks from '../modules/blocks';

import { State } from './model';
import { DEFAULT_GAS } from '../constants';

export const getDefaultTxParams = createStructuredSelector({
  from: fromAccounts.getActiveAccount,
  gas: always(DEFAULT_GAS)
});

export const getSelectors = <T>(getModule: (state: T) => State) => {
  return {
    ...fromSchema.getSelectors(
      createSelector(getModule, m => m[fromSchema.moduleId])
    ),
    ...fromBlocks.getSelectors(
      createSelector(getModule, m => m[fromBlocks.moduleId])
    )
  };
};

export const getContractsFromQueryModel = (userModel: fromEvents.QueryModel) =>
  createSelector(fromSchema.getContractForRef, contractsFromRefs =>
    map(contractsFromRefs, keys(userModel.deps))
  );
