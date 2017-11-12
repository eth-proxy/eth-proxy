import { pipe, flip, toUpper, concat } from "ramda";
import { PropertySignatureStructure } from "ts-simple-ast";

export function solidityToJsType(contractType: string) {
  if (contractType.startsWith("uint") || contractType.startsWith("int")) {
    return "BigNumber";
  }
  if (contractType.startsWith("bytes") || contractType === "address") {
    return "string";
  }
  if (contractType === "bool") {
    return "boolean";
  }
  if (contractType === "address[]") {
    return "string[]";
  }
}

export const capitalize = (text: string) => text.replace(/^./, toUpper);

export const toInputName = (contractName: string) =>
  pipe(capitalize, concat(contractName), flip(concat)("Input"));
export const toOutputName = (contractName: string) =>
  pipe(capitalize, concat(contractName), flip(concat)("Output"));

export function getProperty({
  name,
  type
}: FunctionParameter): PropertySignatureStructure {
  return {
    name: name || "anonymous",
    type: solidityToJsType(type)
  };
}

export function hasComplexInput({
  inputs,
  type
}: AbiDefinition): boolean {
  return (
    type === "function" &&
    inputs.length > 1 &&
    (inputs as FunctionParameter[]).every(i => !!i.name)
  );
}
