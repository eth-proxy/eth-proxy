import { curry, pipe, zipObj } from 'ramda';
import BigNumber from 'bignumber.js';
import { NumberLike } from '../interfaces';
const Coder = require('web3/lib/solidity/coder');

/**
 * Use 3rd party coder to decode params as a list of values
 */
export const decodeParams = curry((types: string[], data: string) => {
  const values: any[] = Coder.decodeParams(types, data);

  return types.map((type, index) => parseArg(type, values[index]));
});

/**
 * Apply custom tranformation to each field of 3rd party coder output
 */
function parseArg(type: string, value: unknown): any {
  if (type.endsWith('[]')) {
    return (value as any[]).map(item => parseArg(type.replace('[]', ''), item));
  }
  if (type.startsWith('uint') || type.startsWith('int')) {
    const hex = new BigNumber(value as NumberLike).toString(16);
    return new BigNumber('0x' + hex);
  }
  return value;
}

interface PropertyDefinition {
  type: string;
  name: string;
}

/**
 * Instead of decoding to array as web3 decode to object using abi names
 */
export function decodeToObj<T extends PropertyDefinition>(deinitions: T[]) {
  return pipe(
    decodeParams(deinitions.map(x => x.type)),
    zipObj(deinitions.map(nameFromDefinition))
  );
}

/**
 * Use either name or index. Abi can contain anonymous and outputs
 */
const nameFromDefinition = (def: PropertyDefinition, index: number) =>
  def.name || index.toString();
