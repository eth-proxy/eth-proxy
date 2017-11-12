import {
  InterfaceDeclarationStructure,
  PropertySignatureStructure
} from "ts-simple-ast";
import { toOutputName, getProperty } from "./utils";

export function getOutputInterfaces({
  contract_name,
  abi
}: TruffleJson): InterfaceDeclarationStructure[] {
  const functionsWithOutputs = abi.filter(
    a => a.type === "function" && a.constant && a.outputs.length > 1
  ) as FunctionDescription[];

  return functionsWithOutputs.map(({ name, outputs }) => ({
    name: toOutputName(contract_name)(name),
    properties: outputs.map(getProperty)
  }));
}
