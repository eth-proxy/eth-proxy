import * as actions from "../actions";
import { createSelector } from "reselect";
import {
  pipe,
  values,
  flatten,
  map,
  keys,
  all
} from "ramda";
import { ContractInfo, QueryModel, ContractRef } from "../../model";
import {
  isString,
} from "../../utils";

import * as Web3 from "web3";

export interface State {
  [contractName: string]: ContractInfo;
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
        [contract_name]: {
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

const contractForRef = (state: State) => (ref: ContractRef) => {
  const name = isString(ref) ? ref : ref.interface;
  const contract = state[name];

  if (!contract) {
    return undefined;
  }
  return {
    ...contract
  };
};

export const getSelectors = <T>(getModule: (state: T) => State) => {
  const getContractForRef = createSelector(getModule, contractForRef);

  const getContractsFromRefs = (refs: ContractRef[]) =>
    createSelector(getContractForRef, getContract => map(getContract, refs));

  const getContractsFromQueryModel = (userModel: QueryModel) =>
    createSelector(getContractForRef, contractsFromRefs =>
      map(contractsFromRefs, keys(userModel.deps))
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

// JUST PROTOTYPE NOT USED ATM
// function userModelToFilter(state: State) {
//   return (model: QueryModel) => {
//     // wait until contracts are available
//     const refsToAddresses = renameBy(
//       pipe(contractForRef(state), x => x.address)
//     );
//     const eventAbis: Web3.AbiDefinition[] = pipe(
//       values,
//       map<any, Web3.AbiDefinition[]>(c => c.abi),
//       flatten
//     )(state);
//     const getEventNameTopic = (eventName: string) =>
//       pipe(
//         find((a: Web3.AbiDefinition) =>
//           caseInsensitiveCompare(a.name, eventName)
//         ),
//         eventAbiToSignature
//       )(eventAbis);

//     return pipe(
//       refsToAddresses,
//       mapObjIndexed(contract => {
//         if (contract === "*") {
//           return "*";
//         }
//         return pipe(
//           renameBy(getEventNameTopic),
//           mapObjIndexed(event => {
//             if (event === "*") {
//               return "*";
//             }
//             return renameBy(eventInputToSignature)(event);
//           })
//         )(contract);
//       })
//     )(model.deps);
//   };
// }

// const renameBy = curry((fn: any, obj) =>
//   pipe(toPairs, map(adjust(fn, 0)), fromPairs)(obj)
// );
