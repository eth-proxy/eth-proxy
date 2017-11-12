import {
  InterfaceDeclarationStructure,
  PropertySignatureStructure
} from "ts-simple-ast";
import {
  toInputName,
  solidityToJsType,
  getProperty,
  hasComplexInput
} from "./utils";

export function getInputInterfaces({
  contract_name,
  abi
}: TruffleJson): InterfaceDeclarationStructure[] {
  const functionsWithExternalInputs = abi.filter(
    hasComplexInput
  ) as FunctionDescription[];

  return functionsWithExternalInputs.map(({ name, inputs }) => ({
    name: toInputName(contract_name)(name),
    properties: inputs.map(getProperty)
  }));
}
