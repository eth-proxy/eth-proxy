export type BlockchainEvent = {
  event: string;
  address: string;
  args: string;
  blockNumber: number;
  topics: string[];
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
}

export interface TransactionReceipt {
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
}
