import { Block } from 'web3';
import * as actions from '../actions/blocks';
import { createSelector } from 'reselect';
import { indexBy, prop, isNil } from 'ramda';

export interface State {
  latest?: number;
  errorLoadingLatest: boolean;
  entities: {
    [blockNumber: number]: Block;
  };
}

const initialState = {
  errorLoadingLatest: false,
  entities: {}
};

export function reducer(
  state: State = initialState,
  action: actions.Types
): State {
  switch (action.type) {
    case actions.UPDATE_LATEST_BLOCK:
      return {
        ...state,
        latest: action.payload.number,
        entities: {
          ...state.entities,
          [action.payload.number]: action.payload
        }
      };
    case actions.UPDATE_LATEST_BLOCK_FAILED:
      return {
        ...state,
        errorLoadingLatest: true
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
  const getErrorLoadingLatest = createSelector(
    getModule,
    m => m.errorLoadingLatest
  );

  const getLatestBlockNumberOrFail = createSelector(
    getLatestBlockNumber,
    getErrorLoadingLatest,
    (latest, errors) => {
      if (!isNil(latest)) {
        return latest;
      }
      if (errors) {
        throw 'Could not load latest block';
      }
    }
  );

  return {
    getLatestBlockNumberOrFail,
    getLatestBlock: createSelector(
      getBlockForNumber,
      getLatestBlockNumber,
      (getBlock, number) => getBlock(number)
    )
  };
};
