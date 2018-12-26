import { curry, isNil, pipe } from 'ramda';
import {
  FunctionParameter,
  FunctionDescription,
  ConstructorDescription
} from '../interfaces';

const Coder = require('web3/lib/solidity/coder');

export const encodeParams = curry(
  (types: string[], params: any[]): string => {
    return Coder.encodeParams(types, params);
  }
);

/**
 * Encode parameters
 * Accept:
 *  - When input has single param accept just it
 *  - When input has multiple params accept them as an object
 */
export function encodeFromObjOrSingle(
  methodAbi: FunctionDescription | ConstructorDescription,
  args: any
) {
  return pipe(
    toListOfValues(methodAbi),
    encodeParams(methodAbi.inputs.map(x => x.type))
  )(args);
}

export const toListOfValues = ({
  inputs
}: FunctionDescription | ConstructorDescription) => {
  return pipe(
    arraifyArgs(inputs),
    formatArgs(inputs)
  );
};

/**
 * Accept single argument or object in case of multiple params
 * Return list ordered by abi indexes
 */
export const arraifyArgs = curry(
  (inputs: FunctionParameter[], args: any): any[] => {
    if (inputs.length === 1) {
      return [args];
    }
    return argsObjToList(inputs, args);
  }
);

export const formatArgs = curry((inputs: FunctionParameter[], args: any[]) => {
  return inputs.map(({ name, type }, index) => {
    const argValue = args[index];
    if (isNil(argValue)) {
      throw Error('Invalid Argument! ' + name);
    }
    return formatArg(type, argValue);
  });
});

/**
 * Apply custom tranformation to make arguments web3 coder compatible
 */
export function formatArg(type: string, value: any) {
  const arrayIndexRe = /\[\d*\]/;

  if (type.match(arrayIndexRe)) {
    // could validate array length
    return value.map((arg: any) =>
      formatArg(type.replace(arrayIndexRe, ''), arg)
    );
  }
  if (type === 'bool') {
    return Boolean(value);
  }
  return value.toString();
}

export function argsObjToList(inputs: FunctionParameter[], args: any) {
  return inputs.map(getPropertyName).map(name => {
    const arg = args[name];
    if (isNil(arg)) {
      throw Error('Invalid Argument! ' + name);
    }
    return arg;
  });
}

/**
 * Property name can be empty so it fallback to index
 */
function getPropertyName(param: FunctionParameter, index: number) {
  return param.name || index.toString();
}
