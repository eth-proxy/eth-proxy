import * as web3Utils from 'web3/lib/utils/utils';
import {
  Provider,
  AbiDefinition,
  FunctionDescription,
  EventDescription,
  ConstructorDescription,
  SendRequest
} from '../interfaces';
import { Observable } from 'rxjs';
import { pipe, isNil } from 'ramda';
import { BigNumber } from 'bignumber.js';

export function bind<T extends (...args: any[]) => any>(fn: T, obj: any): T {
  return fn.bind(obj);
}

const toNumber = (bn: BigNumber) => bn.toNumber();
export const toHex = (input: any) => web3Utils.toHex(input);
const hexToBN = (hex: string) => new BigNumber(hex, 16);
export const ethHexToBN = pipe(
  strip0x,
  hexToBN
);
export const ethHexToNumber = pipe(
  ethHexToBN,
  toNumber
);

export const toAscii = (hex: string) => web3Utils.toAscii(hex);
export const fromAscii = (ascii: string) => web3Utils.fromAscii(ascii);

export const caseInsensitiveCompare = (a: string, b: string) =>
  a && b && a.toLowerCase() === b.toLowerCase();

export function send(provider: Provider): SendRequest {
  return payload =>
    new Observable(observer => {
      provider.sendAsync(payload, (err, response) => {
        if (err) {
          observer.error(err);
          return;
        }
        observer.next(response.result);
        observer.complete();
      });
    });
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

export const isString = (value: any): value is string =>
  typeof value === 'string' || value instanceof String;

export const isNotString = (value: any) => !isString(value);
export function isNotNil<T>(val: T | null | undefined): val is T {
  return !isNil(val);
}
export const arrify = <T>(value: T | T[]) =>
  Array.isArray(value) ? value : [value];
