import { createSelector } from 'reselect';
import * as fromSchema from '../modules/schema';
import * as fromBlocks from '../modules/blocks';

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
    )
  };
};
