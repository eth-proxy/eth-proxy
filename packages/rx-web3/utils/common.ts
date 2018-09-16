import * as Web3 from 'web3';
import {
  Provider,
  AbiDefinition,
  FunctionDescription,
  EventDescription,
  ConstructorDescription
} from '../interfaces';
import { bindNodeCallback } from 'rxjs';
import { curry } from 'ramda';

export const createWeb3 = (provider: Web3.Provider) => new Web3(provider);

export function bind<T extends (...args: any[]) => any>(fn: T, obj: any): T {
  return fn.bind(obj);
}
export const web3 = new Web3();

export const toHex = (input: any) => web3.toHex(input);
export const toAscii = (hex: string) => web3.toAscii(hex);
export const fromAscii = (ascii: string) => web3.fromAscii(ascii);

export const caseInsensitiveCompare = (a: string, b: string) =>
  a && b && a.toLowerCase() === b.toLowerCase();

export function getMethodAbi(abi: Web3.AbiDefinition[], method: string) {
  return abi.find(({ name }) => caseInsensitiveCompare(name, method));
}

export function send(provider: Provider) {
  return bindNodeCallback(bind(provider.sendAsync, provider));
}

export function extractNonTuple(args: any) {
  return args.length === 1 ? args[0] : args;
}

export function strip0x(value: string) {
  return value.startsWith('0x') ? value.substr(2) : value;
}

export function prefix0x(value: string) {
  return '0x' + value;
}

export const getFunction = (name: string, abi: AbiDefinition[]) => {
  const fnAbi = abi.find(
    x => x.type === 'function' && x.name === name
  ) as FunctionDescription;
  if (!abi) {
    throw Error(`Function ${name} not found`);
  }
  return fnAbi;
};

export const isEventAbi = (abi: AbiDefinition): abi is EventDescription => {
  return abi.type === 'event';
};

export const isConstructorAbi = (
  abi: AbiDefinition
): abi is ConstructorDescription => {
  return abi.type === 'constructor';
};
