export interface Block {
  author: string;
  difficulty: any;
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
  totalDifficulty: any;
  transactions: string[];
  transactionsRoot: string;
  uncles: string[];
}
