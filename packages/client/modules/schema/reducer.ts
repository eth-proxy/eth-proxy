import { createSelector } from 'reselect';
import { values, chain } from 'ramda';

import * as actions from '../../actions';
import { dataError, dataOf, isLoaded } from '../../utils';
import { moduleId } from './constants';
import { Data, DataLoaded } from '../../interfaces';
import {
  EthProxyGetSchema,
  ContractInfo,
  GET_SCHEMA
} from '../../methods/get-schema';
import { LOADING } from '../../constants';

export interface State {
  [contractName: string]: Data<ContractInfo>;
}

export function reducer(
  state: State = {},
  action: actions.Types<EthProxyGetSchema>
): State {
  if (action.method !== GET_SCHEMA) {
    return state;
  }

  const { contractName } = action.payload.request[0];
  switch (action.type) {
    case 'request': {
      return {
        ...state,
        [contractName]: LOADING
      };
    }
    case 'response_error': {
      return {
        ...state,
        [contractName]: dataError(action.payload.error)
      };
    }
    case 'response_success': {
      return {
        ...state,
        [contractName]: dataOf(action.payload.result)
      };
    }

    default:
      return state;
  }
}

export const getSelectors = <T = { [moduleId]: State }>(
  getModule: (state: T) => State
) => {
  return {
    getContractsFromNames: (names: string[]) => {
      return createSelector(
        getModule,
        state => {
          if (!names.every(x => isLoaded(state[x]))) {
            return LOADING;
          }
          return dataOf(names.map(x => state[x] as DataLoaded<ContractInfo>));
        }
      );
    },
    getAllAbis: createSelector(
      getModule,
      state => {
        const list = values(state)
          .filter(isLoaded)
          .map(x => x.value);
        return chain(x => x.abi, list);
      }
    ),
    getContractsByName: getModule
  };
};

export const {
  getContractsFromNames,
  getContractsByName,
  getAllAbis
} = getSelectors(m => m[moduleId]);
