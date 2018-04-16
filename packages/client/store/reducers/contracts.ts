import { createSelector } from 'reselect';
import { pipe, values, flatten, map, keys, all, propOr } from 'ramda';

import * as actions from '../actions';
import {
  ContractInfo,
  QueryModel,
  ContractRef,
  LoadingRecord,
  ErrorRecord
} from '../models';
import { isString } from '../../utils';

export interface State {
  [contractName: string]:
    | ContractInfo
    | LoadingRecord<ContractInfo>
    | ErrorRecord<ContractInfo>
    | undefined;
}

export function reducer(
  state: State = {},
  action: actions.ContractTypes
): State {
  switch (action.type) {
    case actions.LOAD_CONTRACT_SCHEMA: {
      return {
        ...state,
        [action.payload.name]: {
          loading: true
        }
      };
    }
    case actions.LOAD_CONTRACT_SCHEMA_FAILED: {
      return {
        ...state,
        [action.payload.name]: {
          error: action.payload.err
        }
      };
    }
    case actions.LOAD_CONTRACT_SCHEMA_SUCCESS: {
      const { address, abi, contractName, genesisBlock } = action.payload;
      return {
        ...state,
        [contractName]: {
          address,
          abi,
          name: contractName,
          genesisBlock
        }
      };
    }

    default:
      return state;
  }
}

const contractForRef = (state: State) => (ref: ContractRef) => {
  return state[isString(ref) ? ref : ref.interface];
};

export const getSelectors = <T>(getModule: (state: T) => State) => {
  const getContractsByName = createSelector(getModule, m => m);
  const getContractForRef = createSelector(getModule, contractForRef);

  const getContractsFromRefs = (refs: ContractRef[]) =>
    createSelector(getContractForRef, getContract => map(getContract, refs));

  const getContractsFromQueryModel = (userModel: QueryModel) =>
    createSelector(getContractForRef, contractsFromRefs =>
      map(contractsFromRefs, keys(userModel.deps))
    );

  const getHasContracts = (res: ContractRef[]) =>
    createSelector(getContractForRef, getContract =>
      pipe(map(getContract), all((x: any) => !!x && !x.loading))(res)
    );

  return {
    getContractFromRef: (contractRef: ContractRef) => (state: T) =>
      getContractForRef(state)(contractRef),
    getContractsFromRefs,
    getAllAbis: createSelector(
      getModule,
      pipe(values, map(propOr([], 'abi')), flatten)
    ),
    getContractsFromQueryModel,
    getHasContracts,
    getContractsByName
  };
};
