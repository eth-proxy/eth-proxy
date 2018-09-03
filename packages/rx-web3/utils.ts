import * as Web3 from 'web3';
import { AbiDefinition, FunctionDescription } from './interfaces';
import * as Coder from 'web3/lib/solidity/coder';
// Cannot import from there
import { formatPayload } from './methods/request/formatters';
import * as ethJSABI from 'ethjs-abi';

export const createWeb3 = (provider: Web3.Provider) => new Web3(provider);

export function bind<T extends (...args: any[]) => any>(fn: T, obj: any): T {
  return fn.bind(obj);
}
const web3 = new Web3();
export const sha3 = (input: any) => web3.sha3(input);
export const toHex = (input: any) => web3.toHex(input);
export const toAscii = (hex: string) => web3.toAscii(hex);
export const fromAscii = (ascii: string) => web3.fromAscii(ascii);

export const caseInsensitiveCompare = (a: string, b: string) =>
  a && b && a.toLowerCase() === b.toLowerCase();

export function getMethodAbi(abi: Web3.AbiDefinition[], method: string) {
  return abi.find(({ name }) => caseInsensitiveCompare(name, method));
}

interface AbstractDefinition {
  name?: string;
  inputs: { type: string }[];
}

export function toSignature<T extends AbstractDefinition>(item: T) {
  const args = item.inputs.map(x => x.type).join(',');

  return sha3(`${item.name}(${args})`);
}

export function toEncodedSignature<T extends AbstractDefinition>(item: T) {
  return '0x' + toSignature(item).slice(0, 8);
}

export function encodeArgs(methodAbi: AbiDefinition, args: any) {
  // return ethJSABI.encodeMethod(methodAbi, formatPayload(args, methodAbi))
  return Coder.encodeParams(
    (methodAbi as FunctionDescription).inputs.map(x => x.type),
    formatPayload(args, methodAbi)
  );
}
