import { SourceFileStructure } from "ts-simple-ast";
import {
  getRootContractsEventsAlias,
  getContractEventsAliases
} from "./events";
import { assoc } from "ramda";
import { numberLike } from "./common/numberlike";

export const getCommonSource = (
  contracts: TruffleJson[]
): SourceFileStructure => {
  return {
    typeAliases: [
      ...getContractEventsAliases(contracts),
      getRootContractsEventsAlias(contracts),
      numberLike()
    ].map(assoc("isExported", true)),
    imports: [
      {
        defaultImport: "BigNumber",
        moduleSpecifier: "bignumber.js"
      }
    ]
  };
};

export * from "./events";
export * from './utils';