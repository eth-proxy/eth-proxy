import { sha3 } from './sha3';
import { FunctionDescription, ConstructorDescription } from '../interfaces';

interface SignaturableDescription {
  name?: string;
  inputs: { type: string }[];
}

/**
 * The signature is defined as the canonical expression of the basic prototype,
 * i.e. the function name with the parenthesised list of * parameter types.
 * https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#function-selector
 */
export function toSignatureHash<T extends SignaturableDescription>(item: T) {
  const args = item.inputs.map(x => x.type).join(',');
  const signature = `${item.name || ''}(${args})`;

  return sha3(signature);
}

/**
 * Get first 4 bytes of the Keccak hash of the ASCII form of the signature
 * https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#function-selector
 */
export function getMethodID(
  functionDesc: FunctionDescription | ConstructorDescription
) {
  return toSignatureHash(functionDesc).slice(0, 10);
}
