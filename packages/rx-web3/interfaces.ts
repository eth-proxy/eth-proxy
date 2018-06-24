import { Observable } from 'rxjs';
import * as Web3 from 'web3';
import { CurriedFunction2 } from 'ramda';

export type ProviderBound<T> = T extends (
  provider: Web3.Provider
) => Observable<infer R>
  ? () => Observable<R>
  : T extends CurriedFunction2<Web3.Provider, infer A1, Observable<infer R>>
    ? (arg: A1) => Observable<R>
    : never;

export type Provider = {
  sendAsync: any;
};
export type BlockchainEvent = {
  event: string;
  address: string;
  args: string;
};
export type FilterObject = {
  fromBlock?: number | string;
  toBlock?: number | string;
  address?: string | string[];
  topics?: string[];
};
export interface Block {
  author: string;
  difficulty: BigNumber;
  extraData: string;
  gasLimit: number;
  gasUsed: number;
  hash: string;
  logsBloom: string;
  miner: string;
  number: number;
  parentHash: string;
  receiptsRoot: string;
  sealFields: string[];
  sha3Uncles: string;
  signature: string;
  size: number;
  stateRoot: string;
  step: string;
  timestamp: number;
  totalDifficulty: BigNumber;
  transactions: string[];
  transactionsRoot: string;
  uncles: string[];
}
export type Transaction = {
  hash: string;
  nonce: number;
  blockHash: string;
  blockNumber: number;
  transactionIndex: number;
  from: string;
  to: string;
  value: BigNumber;
  gasPrice: BigNumber;
  gas: number;
  input: string;
};
export type TransactionReceipt = {
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  cumulativeGasUsed: number;
  gasUsed: number;
  contractAddress: string | null;
  logs: BlockchainEvent[];
  logsBloom: string;
  status: 0 | 1 | null;
};

export interface FunctionParameter {
  name: string;
  type: string;
}

export interface FunctionDescription {
  type: 'function' | 'constructor' | 'fallback';
  name?: string;
  inputs: Array<FunctionParameter>;
  outputs?: Array<FunctionParameter>;
  constant?: boolean;
  payable?: boolean;
}

export interface EventParameter {
  name: string;
  type: string;
  indexed: boolean;
}

export interface EventDescription {
  type: 'event';
  name: string;
  inputs: Array<EventParameter>;
  anonymous: boolean;
}

export type ContractAbi = AbiDefinition[];
export type AbiDefinition = FunctionDescription | EventDescription;
