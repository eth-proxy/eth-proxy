import { createSelector } from 'reselect';
import { values, chain } from 'ramda';

import { dataError, dataOf, isLoaded } from 'client/utils';
import { moduleId } from './constants';
import { ContractInfo, GET_SCHEMA } from 'client/methods/get-schema';
import { Data, DataLoaded } from 'client/interfaces';
import * as actions from 'client/store/actions';
import { LOADING } from 'client/constants';

export interface State {
  [contractName: string]: Data<ContractInfo>;
}

export function reducer(state: State = {}, action: actions.Types): State {
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
          const contracts = names.map(x => state[x] || LOADING);

          if (!contracts.every(isLoaded)) {
            return LOADING;
          }
          return dataOf(
            contracts.map(x => (x as DataLoaded<ContractInfo>).value)
          );
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
