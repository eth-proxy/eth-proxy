import { EthMethod } from './eth';
import { Web3Method } from './web3';
import { TestMethod } from './test';

export type RpcMethod = EthMethod | Web3Method | TestMethod;

export type RpcRequest = RpcMethod['request'];
export type RpcResponse = RpcMethod['response'];

export * from './eth';
export * from './web3';
export * from './test';
