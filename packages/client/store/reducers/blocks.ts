import { Block } from 'web3';
import * as actions from '../actions/blocks';
import { createSelector } from 'reselect';
import { indexBy, prop } from 'ramda';

export interface State {
  latest?: number;
  entities: {
    [blockNumber: number]: Block;
  };
}

const initialState = {
  entities: {}
};

export function reducer(
  state: State = initialState,
  action: actions.Types
): State {
  switch (action.type) {
    case actions.UPDATE_LATEST_BLOCK:
      return {
        latest: action.payload.number,
        entities: {
          ...state.entities,
          [action.payload.number]: action.payload
        }
      };
    default:
      return state;
  }
}

export const getSelectors = <T>(getModule: (state: T) => State) => {
  const getBlockForNumber = createSelector(
    getModule,
    state => (number: number) => state.entities[number]
  );
  const getLatestBlockNumber = createSelector(
    getModule,
    (state: State) => state.latest
  );

  return {
    getLatestBlockNumber,
    getLatestBlock: createSelector(
      getBlockForNumber,
      getLatestBlockNumber,
      (getBlock, number) => getBlock(number)
    )
  };
};
