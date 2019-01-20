import {
  Block,
  isTag,
  ethHexToNumber,
  RawBlock,
  fromBlock,
  EthGetBlockByHash,
  EthGetBlockByNumber
} from '@eth-proxy/rpc';
import { createSelector } from 'reselect';
import { moduleId } from './constants';
import { Data } from '../../interfaces';
import { dataOf, dataError } from '../../utils';
import { LOADING, NOT_ASKED } from '../../constants';
import * as actions from '../../actions';

export interface State {
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
  action: actions.Types<EthGetBlockByHash | EthGetBlockByNumber>
): State {
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
          ? state
          : {
              ...state,
              entities: {
                ...state.entities,
                [ethHexToNumber(atBlock)]: LOADING
              }
            };
      }

      case 'response_error': {
        return numberInRequest
          ? state
          : {
              ...state,
              entities: {
                ...state.entities,
                [ethHexToNumber(atBlock)]: dataError(action.payload)
              }
            };
      }

      case 'response_success': {
        const block = fromBlock(action.payload.result as RawBlock);

        const entities = {
          ...state.entities,
          [block.number]: dataOf(block)
        };

        return {
          ...state,
          entities,
          latestNr:
            block.number > (state.latestNr || 0) ? block.number : state.latestNr
        };
      }

      default:
        return state;
    }
  }
  return state;
}

export const getSelectors = <T = { [moduleId]: State }>(
  getModule: (state: T) => State
) => {
  const _getBlocksByNumber = createSelector(
    getModule,
    x => x.entities
  );

  return {
    getBlocksByNumber: _getBlocksByNumber,
    getBlock: (number: number) =>
      createSelector(
        _getBlocksByNumber,
        blocks => blocks[number] || NOT_ASKED
      ),
    getLatestBlockNumberOrNull: createSelector(
      getModule,
      state => state.latestNr
    ),
    getLatestBlock: createSelector(
      getModule,
      ({ entities, latestNr }) => {
        if (latestNr) {
          return entities[latestNr];
        }
        return LOADING;
      }
    )
  };
};

export const {
  getBlock,
  getLatestBlock,
  getBlocksByNumber,
  getLatestBlockNumberOrNull
} = getSelectors(m => m[moduleId]);
