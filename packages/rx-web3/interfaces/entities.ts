export type BlockchainEvent = {
  event: string;
  address: string;
  args: string;
  blockNumber: number;
  topics: string[];
};

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

export interface Log {
  address: string;
  blockHash: string;
  blockNumber: number;
  data: string;
  logIndex: number;
  removed: boolean;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
}

export enum TransactionStatus {
  Failure = 0,
  Success = 1
}
