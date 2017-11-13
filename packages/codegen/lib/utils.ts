import { pipe, flip, toUpper, concat, curry, CurriedFunction2 } from "ramda";
import { PropertySignatureStructure } from "ts-simple-ast";

export function solidityToJsStrictType(contractType: string) {
  if (contractType.startsWith("uint") || contractType.startsWith("int")) {
    return "BigNumber";
  }
  if (
    contractType.startsWith("bytes") ||
    contractType === "address" ||
    contractType === "string"
  ) {
    return "string";
  }
  if (contractType === "bool") {
    return "boolean";
  }
  if (contractType === "address[]") {
    return "string[]";
  }
}

export function solidityToJsType(contractType: string) {
  const strictType = solidityToJsStrictType(contractType);
  if (strictType === "BigNumber") {
    return "BigNumber | number";
  }
  return strictType;
}

export const capitalize = (text: string) => text.replace(/^./, toUpper);

const toName = curry(
  (postfix: string, contractName: string, name: string) =>
    `${contractName}${capitalize(name)}${postfix}`
);

export const toInputName = toName("Input");
export const toOutputName = toName("Output");
export const toEventPayloadName = toName("Payload");
export const toEventName = toName("Event");
export const toContractEventsName = toName("Events");

export function getProperty({
  name,
  type
}: FunctionParameter): PropertySignatureStructure {
  return {
    name: name || "anonymous",
    type: solidityToJsType(type)
  };
}

export function hasComplexInput({ inputs, type }: AbiDefinition): boolean {
  return (
    type === "function" &&
    inputs.length > 1 &&
    (inputs as FunctionParameter[]).every(i => !!i.name)
  );
}
