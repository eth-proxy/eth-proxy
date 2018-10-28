import { Block } from '@eth-proxy/rpc';
import * as actions from './actions';
import { createSelector } from 'reselect';
import { moduleId } from './constants';
import { Data } from '../../interfaces';
import { dataOf, dataError } from '../../utils';
import { LOADING, NOT_ASKED } from '../../constants';

export interface State {
  errorLoadingLatest: boolean;
  latestNr?: number;
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
      const { number } = action.payload;

      const entities = {
        ...state.entities,
        [number]: dataOf(action.payload)
      };

      return {
        ...state,
        entities,
        latestNr: number > (state.latestNr || 0) ? number : state.latestNr
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

  const getLatestBlockNumberOrNull = createSelector(
    getState,
    state => state.latestNr
  );

  const getLatestBlock = createSelector(
    getState,
    ({ entities, errorLoadingLatest, latestNr }) => {
      if (latestNr) {
        return entities[latestNr];
      }
      if (errorLoadingLatest) {
        return dataError('Could not load latest block');
      }
      return LOADING;
    }
  );

  return {
    getBlock,
    getBlocksByNumber,
    getLatestBlockNumberOrNull,
    getLatestBlock
  };
};

export const {
  getBlock,
  getLatestBlock,
  getBlocksByNumber,
  getLatestBlockNumberOrNull
} = getSelectors(m => m[moduleId]);
