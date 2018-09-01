import * as Web3 from 'web3';

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
