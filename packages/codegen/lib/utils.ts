import { pipe, flip, toUpper, concat, curry, CurriedFunction2, CurriedFunction3 } from "ramda";
import { PropertySignatureStructure } from "ts-simple-ast";

export function solidityToJsOutputType(contractType: string) {
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

export function solidityToJsInputType(contractType: string) {
  const strictType = solidityToJsOutputType(contractType);
  if (strictType === "BigNumber") {
    return "BigNumber | number | string";
  }
  return strictType;
}

export const capitalize = (text: string) => text.replace(/^./, toUpper);

export const toName = curry(
  (postfix: string, contractName: string, name: string) =>
    `${contractName}${capitalize(name)}${postfix}`
);

export const toInputName = toName("Input");
export const toOutputName = toName("Output");
export const toEventPayloadName = toName("Payload");
export const toEventName = toName("Event");
export const toContractEventsName = toName("Events");

export function getInputProperty({
  name,
  type
}: FunctionParameter, index: number): PropertySignatureStructure {
  return {
    name: name || "anonymous" + index,
    type: solidityToJsInputType(type)
  };
}

export function getOutputProperty({
  name,
  type
}: FunctionParameter, index: number): PropertySignatureStructure {
  return {
    name: name || "anonymous" + index,
    type: solidityToJsOutputType(type)
  };
}