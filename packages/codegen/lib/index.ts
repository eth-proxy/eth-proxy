import { SourceFileStructure } from "ts-simple-ast";
import {
  getRootContractsEventsAlias,
  getContractEventsAliases
} from "./events";
import { assoc } from "ramda";

export const getCommonSource = (
  contracts: TruffleJson[]
): SourceFileStructure => {
  return {
    typeAliases: [
      ...getContractEventsAliases(contracts),
      getRootContractsEventsAlias(contracts)
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