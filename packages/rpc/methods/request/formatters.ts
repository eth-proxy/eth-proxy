import { isNil, evolve, pick, curry } from 'ramda';
import { formatQuantity } from '../../formatters';
import {
  ContractRequestParams,
  RequestInputParams,
  FunctionDescription,
  ConstructorDescription,
  FunctionParameter
} from '../../interfaces';
const Coder = require('web3/lib/solidity/coder');

export function encodeArgs(
  methodAbi: FunctionDescription | ConstructorDescription,
  args: any
) {
  return Coder.encodeParams(
    methodAbi.inputs.map(x => x.type),
    formatPayload(args, methodAbi)
  );
}

export const decodeArgs = curry(
  ({ outputs = [] }: FunctionDescription, data: string) => {
    return Coder.decodeParams(outputs.map(x => x.type), data);
  }
);

export function formatPayload(
  userPayload,
  { inputs }: FunctionDescription | ConstructorDescription
) {
  return formatArgs(inputs, arraifyArgs(inputs, userPayload));
}

export function arraifyArgs(inputs: FunctionParameter[], args): any[] {
  if (inputs.length === 1) {
    return [args];
  }
  return orderArgs(inputs, args);
}

export function orderArgs(inputs: FunctionParameter[], args: any) {
  return inputs.map(({ name }) => {
    const arg = args[name];
    if (isNil(arg)) {
      throw Error('Invalid Argument! ' + name);
    }
    return arg;
  });
}

export function formatArgs(inputs: FunctionParameter[], args: any[]) {
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

export const requestParamsKeys = [
  'from',
  'to',
  'gas',
  'gasPrice',
  'value',
  'data'
];
export function formatRequestInput(params: RequestInputParams) {
  return evolve(
    {
      gasPrice: formatQuantity,
      gas: formatQuantity,
      value: formatQuantity
    },
    pick(requestParamsKeys, params)
  ) as ContractRequestParams;
}
