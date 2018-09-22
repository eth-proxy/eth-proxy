import { Block } from '@eth-proxy/rx-web3';
import * as actions from './actions';
import { createSelector } from 'reselect';
import { isNil, keys, isEmpty } from 'ramda';
import { moduleId } from './constants';
import { Data } from '../../interfaces';
import { dataOf, dataError } from '../../utils';
import { LOADING, NOT_ASKED } from '../../constants';

export interface State {
  errorLoadingLatest: boolean;
  entities: {
    [blockNumber: number]: Data<Block>;
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
    case actions.LOAD_BLOCK: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload]: LOADING
        }
      };
    }

    case actions.LOAD_BLOCK_FAILED: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.number]: dataError(action.payload)
        }
      };
    }

    case actions.LOAD_BLOCK_SUCCESS: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.number]: dataOf(action.payload)
        }
      };
    }

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
  const getState = createSelector(getModule, (state: State) => state);
  const getBlocksByNumber = createSelector(getState, x => x.entities);
  const getBlock = (number: number) =>
    createSelector(getBlocksByNumber, blocks => blocks[number] || NOT_ASKED);

  const getLatestBlockNumber = createSelector(getBlocksByNumber, entities => {
    const numbers = keys(entities).map(Number);
    if (isEmpty(numbers)) {
      return undefined;
    }
    return Math.max(...numbers);
  });

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
  const getLatestBlock = createSelector(
    getState,
    getLatestBlockNumber,
    (entities, number) => (!isNil(number) ? entities[number] : null)
  );

  return {
    getBlock,
    getBlocksByNumber,
    getLatestBlockNumber,
    getLatestBlockNumberOrFail,
    getLatestBlock
  };
};

export const {
  getBlock,
  getLatestBlock,
  getLatestBlockNumberOrFail,
  getBlocksByNumber,
  getLatestBlockNumber
} = getSelectors(m => m[moduleId]);
