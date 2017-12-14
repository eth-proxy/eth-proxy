import { pipe, flip, toUpper, concat, curry, CurriedFunction2 } from "ramda";
import { PropertySignatureStructure } from "ts-simple-ast";

export function solidityToJsOutputType(contractType: string): string {
  if (contractType.includes('[]')) {
    const itemType = contractType.replace('[]', '');
    const jsItemType = solidityToJsOutputType(itemType);
    return jsItemType + '[]'
  }
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
}

export function solidityToJsInputType(contractType: string) {
  const strictType = solidityToJsOutputType(contractType);
  return strictType.replace('BigNumber', "NumberLike");
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
    type: solidityToJsInputType(type)
  };
}
