import {
  Provider,
  AbiDefinition,
  FunctionDescription,
  EventDescription,
  ConstructorDescription,
  SendObservableRequest,
  SendRequest,
  NumberLike,
  Tag,
  RpcMethod,
  RpcRequest,
  RpcResponse,
  RpcResponses,
  Batch
} from '../interfaces';
import { pipe, isNil, values, head, contains, curry } from 'ramda';
import { BigNumber } from 'bignumber.js';
import { tags } from '../constants';
import { defer } from 'rxjs';

export function bind<T extends (...args: any[]) => any>(fn: T, obj: any): T {
  return fn.bind(obj);
}

const toNumber = (bn: BigNumber) => bn.toNumber();
const hexToBN = (hex: string) => new BigNumber(hex, 16);
export const ethHexToBN = pipe(
  strip0x,
  hexToBN
);
export const ethHexToNumber = pipe(
  ethHexToBN,
  toNumber
);

export const caseInsensitiveCompare = (a: string, b: string) =>
  a && b && a.toLowerCase() === b.toLowerCase();

export function extractNonTuple(args: {}) {
  const argsValues = values(args);

  return argsValues.length === 1 ? head(argsValues) : args;
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

export const isFunctionAbi = (
  abi: AbiDefinition
): abi is FunctionDescription => {
  return abi.type === 'function';
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

export function createIdGenerator() {
  let id = 0;
  return () => id++;
}

export function send$(provider: Provider): SendObservableRequest {
  return payload => defer(() => send(provider)(payload));
}

export function send(provider: Provider): SendRequest {
  return payload => provider.send(payload).then(r => unwrapResults(payload, r));
}

function unwrapResults<R extends RpcRequest | RpcRequest[]>(
  requests: R,
  response: RpcResponses<R>
) {
  if (isSingleReq(requests)) {
    return ((response as any) as RpcResponse).result;
  }

  return ((response as any) as RpcResponse[]).map(x => x.result);
}

export const bnOf = (value: NumberLike, base?: number) =>
  new BigNumber(value, base);

export function isBoolean(variable: any): variable is boolean {
  return typeof variable === 'boolean';
}

export function isTag(value: string | NumberLike): value is Tag {
  return contains(value, tags);
}

export interface RequestDef<T extends RpcMethod, R> {
  payload: T['request'];
  parseResult: (result: T['response']['result']) => R;
}

export interface MethodDef<Input, M extends RpcMethod, R> {
  request: (input: Input) => M['request'];
  result: (result: M['response']['result']) => R;
}

export function createRequest<Input, M extends RpcMethod, R>(
  methodDef: MethodDef<Input, M, R>
) {
  return (input: Input): RequestDef<M, R> => {
    const { request, result } = methodDef;
    return {
      payload: request(input),
      parseResult: result
    };
  };
}

export function createMethod<Input, M extends RpcMethod, R>(
  methodDef: MethodDef<Input, M, R>
) {
  return curry((provider: Provider, input: Input) => {
    const { request, result } = methodDef;
    const payload = request(input);
    return send(provider)(payload).then(result);
  });
}

export const sendRequest = curry(
  ({ payload, parseResult }: RequestDef<any, any>, provider: Provider) => {
    return send(provider)(payload).then(parseResult);
  }
);

export function isBatch<R extends RpcRequest | RpcRequest[]>(
  payload: R
): payload is Batch<R> {
  return Array.isArray(payload);
}
export function isSingleReq<R extends RpcRequest | RpcRequest[]>(
  payload: R
): payload is Extract<R, RpcRequest> {
  return !isBatch(payload);
}
