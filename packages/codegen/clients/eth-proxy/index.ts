import { SourceFileStructure } from "ts-simple-ast";
import { imports } from "./imports";
import { getContractInterface } from "./contract";
import { createEventInterface } from "./events";
import {
  getRootContractsEventsAlias,
  getContractEventsAliases,
  createEventInterfaces
} from "../../lib";
import { getRootInterface } from "./root";
import { transactionOptions } from "./transaction-options";
import { getOutputInterfaces } from "./outputs";
import { getInputInterfaces } from "./inputs";
import { map, chain, assoc } from "ramda";

export function getSourceFile(contracts: TruffleJson[]): SourceFileStructure {
  return {
    imports,
    interfaces: [
      getRootInterface(contracts),
      ...map(getContractInterface, contracts),
      ...chain(getInputInterfaces, contracts),
      ...chain(getOutputInterfaces, contracts),
      ...createEventInterfaces(createEventInterface)(contracts),      
      transactionOptions
    ].map(assoc("isExported", true))
  };
}
