import { toUpper, curry } from 'ramda';
import { PropertySignatureStructure } from 'ts-simple-ast';
import { FunctionParameter } from '@eth-proxy/rpc';

export function solidityToJsOutputType(type: string): string {
  const arrayIndexRe = /\[\d*\]/;

  const arrayMatch = type.match(arrayIndexRe);

  if (arrayMatch) {
    const itemType = type.replace(arrayIndexRe, '');
    const jsItemType = solidityToJsOutputType(itemType);
    return jsItemType + '[]';
  }
  if (type.startsWith('uint') || type.startsWith('int')) {
    return 'BigNumber';
  }
  if (type.startsWith('bytes') || type === 'address' || type === 'string') {
    return 'string';
  }
  if (type === 'bool') {
    return 'boolean';
  }
  throw Error(`Unknown type, ${type}`);
}

export function solidityToJsInputType(type: string) {
  const strictType = solidityToJsOutputType(type);
  return strictType.replace('BigNumber', 'NumberLike');
}

export const capitalize = (text: string) => text.replace(/^./, toUpper);

export const toName = curry(
  (postfix: string, contractName: string, name: string) =>
    `${contractName}${capitalize(name)}${postfix}`
);

export const toInputName = toName('Input');
export const toOutputName = toName('Output');
export const toEventPayloadName = toName('Payload');
export const toEventName = toName('Event');
export const toContractEventsName = toName('Events');
export const toEventsByTypeName = (contractName: string) =>
  contractName + 'EventsByType';

export function getInputProperty(
  { name, type }: FunctionParameter,
  index: number
): PropertySignatureStructure {
  return {
    name: name || index.toString(),
    type: solidityToJsInputType(type)
  };
}

export function getOutputProperty(
  { name, type }: FunctionParameter,
  index: number
): PropertySignatureStructure {
  return {
    name: name || index.toString(),
    type: solidityToJsOutputType(type)
  };
}
