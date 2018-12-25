/* tslint:disable */
import { BigNumber } from 'bignumber.js';

export type ERC20Events = ERC20ApprovalEvent | ERC20TransferEvent;
export type KitchenSinkEvents = never;
export type ContractsEvents = ERC20Events | KitchenSinkEvents;
export type NumberLike = BigNumber | string | number;

export interface EventsByType {
  ERC20: ERC20EventsByType;
  KitchenSink: KitchenSinkEventsByType;
}

export interface ERC20EventsByType {
  Approval: ERC20ApprovalEvent;
  Transfer: ERC20TransferEvent;
}

export interface KitchenSinkEventsByType {}

export interface TransactionOptions {
  from?: string;
  value?: NumberLike;
  gas?: NumberLike;
  gasPrice?: NumberLike;
  nonce?: NumberLike;
}

export interface Contracts {
  ERC20: ERC20;
  KitchenSink: KitchenSink;
}

export interface ERC20 extends TruffleContractInstance {
  approve(
    spender: string,
    value: NumberLike,
    options?: TransactionOptions
  ): Promise<TransactionResult>;
  testFixedArray(
    someBytes32Arr3: string[],
    options?: TransactionOptions
  ): Promise<TransactionResult>;
  totalSupply(options?: TransactionOptions): Promise<BigNumber>;
  transferFrom(
    from: string,
    to: string,
    value: NumberLike,
    options?: TransactionOptions
  ): Promise<TransactionResult>;
  balanceOf(who: string, options?: TransactionOptions): Promise<BigNumber>;
  transfer(
    to: string,
    value: NumberLike,
    options?: TransactionOptions
  ): Promise<TransactionResult>;
  allowance(
    owner: string,
    spender: string,
    options?: TransactionOptions
  ): Promise<BigNumber>;
}

export interface KitchenSink extends TruffleContractInstance {
  approve(
    spender: string,
    value: NumberLike,
    options?: TransactionOptions
  ): Promise<[boolean, BigNumber, string]>;
}

export interface ERC20ApprovalPayload {
  owner: string;
  spender: string;
  value: BigNumber;
}

export interface ERC20ApprovalEvent extends EventMetadata {
  event: 'Approval';
  args: ERC20ApprovalPayload;
}

export interface ERC20TransferPayload {
  from: string;
  to: string;
  value: BigNumber;
}

export interface ERC20TransferEvent extends EventMetadata {
  event: 'Transfer';
  args: ERC20TransferPayload;
}

export interface EventMetadata {
  type: string;
  address: string;
  logIndex: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
}

export interface TransactionResult {
  logs: ContractsEvents[];
  receipt: Receipt;
  tx: string;
}

export interface TruffleContractInstance {
  allEvents: any;
  address: string;
  abi: any[];
  contract: any;
  constructor: { currentProvider: any; contractName: string };
  send(value: NumberLike): Promise<TransactionResult>;
}

export interface Receipt {
  blockHash: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  from: string;
  to: string;
  cumulativeGasUsed: number;
  gasUsed: number;
  contractAddress: string | null;
  logs: any[];
}

export interface TruffleContractAbstraction<T extends TruffleContractInstance> {
  abi: any[];
  networks: any[];
  network: any;
  address: string;
  new: (...args: any[]) => Promise<T>;
  at(address: string): T;
  setProvider(provider: any): void;
  deployed(): Promise<T>;
  link<V extends TruffleContractInstance>(
    contract: TruffleContractAbstraction<V>
  ): void;
  link(name: string, address: string): void;
  setNetwork(networkId: string): void;
  hasNetwork(networkId: string): boolean;
  defaults(defaults: TransactionOptions): void;
  clone(networkId: string): TruffleContractAbstraction<T>;
}

export enum ContractsNames {
  ERC20 = 'ERC20',
  KitchenSink = 'KitchenSink'
}
