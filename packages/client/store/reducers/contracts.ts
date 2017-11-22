import * as actions from "../actions";
import { createSelector } from "reselect";
import {
  pipe,
  values,
  find,
  flatten,
  map,
  curry,
  toPairs,
  adjust,
  fromPairs,
  mapObjIndexed,
  keys,
  filter,
  all
} from "ramda";
import * as Web3 from "web3";
import { ContractInfo, QueryModel, ContractRef } from "../../model";
import {
  eventAbiToSignature,
  eventInputToSignature,
  isString
} from "../../utils";

export interface State {
  [address: string]: ContractInfo;
}

export function reducer(
  state: State = {},
  action: actions.ContractTypes
): State {
  switch (action.type) {
    case actions.REGISTER_CONTRACT:
      const { address, abi, contract_name, genesisBlock } = action.payload;
      return {
        ...state,
        [address]: {
          address,
          abi,
          name: contract_name,
          genesisBlock
        }
      };
    default:
      return state;
  }
}

const caseInsensitiveCompare = (a: string, b: string) =>
  a && b && a.toLowerCase() === b.toLowerCase();

const contractForRef = (state: State) => (ref: ContractRef) =>
  pipe(
    values,
    find<ContractInfo>(c => {
      const nameOrAddress = isString(ref) ? ref : ref.interface;
      return (
        caseInsensitiveCompare(c.name, nameOrAddress) ||
        caseInsensitiveCompare(c.address, nameOrAddress)
      );
    })
  )(state);

export const getSelectors = <T>(getModule: (state: T) => State) => {
  const getContractForRef = createSelector(getModule, contractForRef);

  const getContractsFromRefs = (refs: ContractRef[]) =>
    createSelector(getContractForRef, getContract => map(getContract, refs));

  const getUserModelToFilter = createSelector(getModule, userModelToFilter);

  const getContractsFromQueryModel = (userModel: QueryModel) =>
    createSelector(
      getUserModelToFilter,
      getContractForRef,
      (userModelToFilter, contractsFromRefs) =>
        pipe(userModelToFilter, keys, map(contractsFromRefs))(userModel)
    );

  const getHasContracts = (res: ContractRef[]) =>
    createSelector(getContractForRef, getContract =>
      pipe(map(getContract), all(x => !!x))(res)
    );

  return {
    getContractFromRef: (contractRef: ContractRef) => (state: T) =>
      getContractForRef(state)(contractRef),
    getContractsFromRefs,
    getAllAbis: createSelector(
      getModule,
      pipe(values, map(c => c.abi), flatten)
    ),
    getContractsFromQueryModel,
    getHasContracts
  };
};

function userModelToFilter(state: State) {
  return (model: QueryModel) => {
    // wait until contracts are available
    const refsToAddresses = renameBy(
      pipe(contractForRef(state), x => x.address)
    );
    const eventAbis: Web3.AbiDefinition[] = pipe(
      values,
      map<any, Web3.AbiDefinition[]>(c => c.abi),
      flatten
    )(state);
    const getEventNameTopic = (eventName: string) =>
      pipe(
        find((a: Web3.AbiDefinition) =>
          caseInsensitiveCompare(a.name, eventName)
        ),
        eventAbiToSignature
      )(eventAbis);

    return pipe(
      refsToAddresses,
      mapObjIndexed(contract => {
        if (contract === "*") {
          return "*";
        }
        return pipe(
          renameBy(getEventNameTopic),
          mapObjIndexed(event => {
            if (event === "*") {
              return "*";
            }
            return renameBy(eventInputToSignature)(event);
          })
        )(contract);
      })
    )(model.deps);
  };
}

const renameBy = curry((fn: any, obj) =>
  pipe(toPairs, map(adjust(fn, 0)), fromPairs)(obj)
);
