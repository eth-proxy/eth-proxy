import { SourceFileStructure } from "ts-simple-ast";
import {
  createEventInterfaces,
  getContractEventsAliases,
  getRootContractsEventsAlias
} from "../../lib";
import { chain, assoc } from "ramda";

import { createEventDeclaration, eventMetadata } from "./events";

export function getSourceFile(contracts: TruffleJson[]): SourceFileStructure {
  return {
    interfaces: [
      ...createEventInterfaces(createEventDeclaration)(contracts),
      eventMetadata
    ].map(assoc("isExported", true))
  };
}
