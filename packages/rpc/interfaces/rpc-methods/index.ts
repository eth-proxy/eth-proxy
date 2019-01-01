import { EthMethod } from './eth';
import { Web3Method } from './web3';
import { TestMethod } from './test';
import { SubscriptionMethod } from './subscriptions';

export type RpcMethod =
  | EthMethod
  | Web3Method
  | TestMethod
  | SubscriptionMethod;

export type RpcMethodDict = {
  [Type in RpcMethod['type']]: Extract<RpcMethod, { type: Type }>
};

export type ResponsesByMethod = {
  [Type in keyof RpcMethodDict]: RpcMethodDict[Type]['response']
};

// The conditional check should not be necessary
type BatchResponses<R extends RpcRequest[]> = {
  [K in keyof R]: ResponsesByMethod[R[K] extends RpcRequest
    ? R[K]['method']
    : never]
};
type BatchResults<R extends RpcRequest[]> = {
  [K in keyof R]: ResponsesByMethod[R[K] extends RpcRequest
    ? R[K]['method']
    : never]['result']
};

export type RpcResponses<
  R extends RpcRequest | RpcRequest[]
> = R extends RpcRequest[]
  ? BatchResponses<R>
  : R extends RpcRequest
  ? ResponsesByMethod[R['method']]
  : never;

export type RpcResults<
  R extends RpcRequest | RpcRequest[]
> = R extends RpcRequest[]
  ? BatchResults<R>
  : R extends RpcRequest
  ? ResponsesByMethod[R['method']]['result']
  : never;

export type RpcRequest = RpcMethod['request'];
export type RpcResponse = RpcMethod['response'];

export * from './eth';
export * from './web3';
export * from './test';
export * from './subscriptions';
