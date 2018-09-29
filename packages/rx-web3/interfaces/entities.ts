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
