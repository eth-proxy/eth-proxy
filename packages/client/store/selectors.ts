import { createSelector } from 'reselect';
import * as fromSchema from '../modules/schema';
import * as fromBlocks from '../modules/blocks';
import * as fromAccount from '../modules/account';
import * as fromNetwork from '../modules/network';

import { State } from './model';

export const getSelectors = <T>(getModule: (state: T) => State) => {
  return {
    ...fromSchema.getSelectors(
      createSelector(
        getModule,
        m => m[fromSchema.moduleId]
      )
    ),
    ...fromBlocks.getSelectors(
      createSelector(
        getModule,
        m => m[fromBlocks.moduleId]
      )
    ),
    ...fromAccount.getSelectors(
      createSelector(
        getModule,
        m => m[fromAccount.moduleId]
      )
    ),
    ...fromNetwork.getSelectors(
      createSelector(
        getModule,
        m => m[fromNetwork.moduleId]
      )
    )
  };
};
