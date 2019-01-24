import BigNumber from 'bignumber.js';

export interface BlockchainEvent {
  event: string;
  address: string;
  args: string;
  blockNumber: number;
  topics: string[];
}

export interface Log {
  data: string;
  removed: boolean;
  address: string;
  logIndex: number;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  topics: string[];
}

export interface Block {
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
  sha3Uncles: string;
  size: number;
  stateRoot: string;
  timestamp: number;
  totalDifficulty: BigNumber;
  transactions: string[] | Transaction[];
  transactionsRoot: string;
  uncles: string[];
  mixHash: string;
  nonce: string;
}

export interface Transaction {
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
  r: string;
  s: string;
  v: string;
}

export interface TransactionReceipt {
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  cumulativeGasUsed: number;
  gasUsed: number;
  contractAddress: string | null;
  logs: Log[];
  logsBloom: string;
  status: TransactionStatus;
  from: string;
  to: string;
}

export enum TransactionStatus {
  Failure = 0,
  Success = 1
}

export interface DecodedEvent<T = any> {
  type: string;
  payload: T;
  meta: EventMetadata;
}

export type EventMetadata = Log & {
  type: string;
};
