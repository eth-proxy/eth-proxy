import { Quantity, Data, Tag } from './primitives';

export interface ContractRequestParams {
  from: Data;
  to: Data;
  gas: Quantity;
  gasPrice: Quantity;
  value: Quantity;
  data: Data;
}

export interface TransactionParams extends ContractRequestParams {
  nonce: Quantity;
}

export interface RawBlock {
  number: Quantity;
  hash: Data;
  parentHash: Data;
  nonce: Data;
  sha3Uncles: Data;
  logsBloom: Data;
  transactionsRoot: Data;
  stateRoot: Data;
  receiptsRoot: Data;
  miner: Data;
  difficulty: Quantity;
  totalDifficulty: Quantity;
  extraData: Data;
  size: Quantity;
  gasLimit: Quantity;
  gasUsed: Quantity;
  timestamp: Quantity;
  transactions: RawTransaction[] | Data[];
  uncles: Data[];
  mixHash: Data;
}

export interface RawTransaction {
  blockHash: Data;
  blockNumber: Quantity;
  from: Data;
  gas: Quantity;
  gasPrice: Quantity;
  hash: Data;
  input: Data;
  nonce: Quantity;
  to: Data;
  transactionIndex: Quantity;
  value: Quantity;
  v: Quantity;
  r: Data;
  s: Data;
}

export interface RawTransactionReceipt {
  blockHash: Data;
  blockNumber: Quantity;
  contractAddress: null | Data;
  cumulativeGasUsed: Quantity;
  from: Data;
  gasUsed: Quantity;
  logs: RawLog[];
  logsBloom: Data;
  status: Quantity;
  to: Data;
  transactionIndex: Quantity;
  transactionHash: Data;
}

export interface RawLog {
  address: Data;
  blockHash: Data;
  blockNumber: Quantity;
  data: Data;
  logIndex: Quantity;
  removed: boolean;
  topics: Data[];
  transactionHash: Data;
  transactionIndex: Quantity;
}

export interface RawLogFilter {
  address?: Data | Data[];
  topics?: (Data | Data[])[];
}

export interface RawRangeFilter {
  fromBlock?: Quantity | Tag;
  toBlock?: Quantity | Tag;
}

export type RawFilter = RawLogFilter & RawRangeFilter;

export interface RawSyncingState {
  syncing: boolean;
  status: {
    startingBlock: number;
    currentBlock: number;
    highestBlock: number;
    pulledStates: number;
    knownStates: number;
  };
}
