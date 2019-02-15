import {
  Block,
  isTag,
  ethHexToNumber,
  fromBlock,
  RawBlock
} from '@eth-proxy/rpc';
import * as actions from 'client/store/actions';
import { createSelector } from 'reselect';
import { moduleId } from './constants';
import { Data } from '../../interfaces';
import { dataOf, dataError } from '../../utils';
import { LOADING } from '../../constants';
import { isNil } from 'ramda';

export interface State {
  latestNr?: number;
  latestLoadedNr?: number;
  entities: {
    [blockNumber: number]: Data<Block>;
  };
}

const initialState = {
  entities: {}
};

export function reducer(
  state: State = initialState,
  action: actions.Types
): State {
  if (action.method === 'newHeads') {
    return rawBlockHandler(state, action.payload);
  }

  if (
    action.method === 'eth_blockNumber' &&
    action.type === 'response_success'
  ) {
    const loadedNr = ethHexToNumber(action.payload.result);
    return {
      ...state,
      latestNr: Math.max(state.latestNr || loadedNr, loadedNr)
    };
  }
  if (
    action.method === 'eth_getBlockByHash' ||
    action.method === 'eth_getBlockByNumber'
  ) {
    const [atBlock] = action.payload.request;
    const numberInRequest =
      !isTag(atBlock) && action.method === 'eth_getBlockByNumber';

    switch (action.type) {
      case 'request': {
        return numberInRequest
          ? {
              ...state,
              entities: {
                ...state.entities,
                [ethHexToNumber(atBlock)]: LOADING
              }
            }
          : state;
      }

      case 'response_error': {
        return numberInRequest
          ? {
              ...state,
              entities: {
                ...state.entities,
                [ethHexToNumber(atBlock)]: dataError(action.payload)
              }
            }
          : state;
      }

      case 'response_success':
        return rawBlockHandler(state, action.payload.result);
      default:
        return state;
    }
  }
  return state;
}

function rawBlockHandler(state: State, rawBlock: RawBlock) {
  {
    const block = fromBlock(rawBlock);

    const entities = {
      ...state.entities,
      [block.number]: dataOf(block)
    };

    return {
      ...state,
      entities,
      latestNr: Math.max(state.latestNr || block.number, block.number),
      latestLoadedNr: Math.max(
        state.latestLoadedNr || block.number,
        block.number
      )
    };
  }
}

export const getSelectors = <T = { [moduleId]: State }>(
  getModule: (state: T) => State
) => {
  const getState = createSelector(
    getModule,
    (state: State) => state
  );
  const getBlocksByNumber = createSelector(
    getState,
    x => x.entities
  );

  const getLatestBlockNr = createSelector(
    getState,
    ({ latestNr }) => {
      if (isNil(latestNr)) {
        return LOADING;
      }

      return dataOf(latestNr);
    }
  );

  const getLatestBlock = createSelector(
    getState,
    ({ entities, latestLoadedNr }) => {
      return isNil(latestLoadedNr) ? LOADING : entities[latestLoadedNr];
    }
  );

  return {
    getBlocksByNumber,
    getLatestBlockNr,
    getLatestBlock
  };
};
