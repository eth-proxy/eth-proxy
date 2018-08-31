import * as Web3 from 'web3';
import { isNil, contains } from 'ramda';

export function formatPayload(userPayload, { inputs }: Web3.AbiDefinition) {
  return formatArgs(inputs, arraifyArgs(inputs, userPayload));
}

export function arraifyArgs(inputs: Web3.FunctionParameter[], args): any[] {
  if (inputs.length === 1) {
    return [args];
  }
  return orderArgs(inputs, args);
}

export function orderArgs(inputs: Web3.FunctionParameter[], args: any) {
  return inputs.map(({ name }) => {
    const arg = args[name];
    if (isNil(arg)) {
      throw Error('Invalid Argument! ' + name);
    }
    return arg;
  });
}

export function formatArgs(inputs: Web3.FunctionParameter[], args: any[]) {
  return inputs.map(({ name, type }, index) => {
    const argValue = args[index];
    if (isNil(argValue)) {
      throw Error('Invalid Argument! ' + name);
    }
    return formatArg(type, argValue);
  });
}

export function formatArg(type: string, value: any) {
  const arrayIndexRe = /\[\d*\]/;

  if (type.match(arrayIndexRe)) {
    // could validate array length
    return value.map(arg => formatArg(type.replace(arrayIndexRe, ''), arg));
  }
  if (type === 'bool') {
    return Boolean(value);
  }
  return value.toString();
}
