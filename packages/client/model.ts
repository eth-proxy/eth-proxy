import * as Web3 from "web3";
import { Observable } from "rxjs/Observable";
import { RegisterContractOptions } from "./modules/register-contract";

export type Send<T> = <CK extends keyof T>(
  nameOrAddress: ContractRef<CK>
) => <MK extends keyof T[CK]>(method: MK) => T[CK][MK];

export class EthProxy<T = {}> {
  registerContract: (abi, options: RegisterContractOptions) => void;

  send: Send<T>;
  query: (queryModel: QueryModel<T>) => Observable<any>;
  
  // rxweb3
  getBalance: (account: string) => Observable<any>;
  getLatestBlock: () => Observable<Block>;
  getBlock: (args) => Observable<Block>;

  provider$: Observable<Web3.Provider>;
  network$: Observable<string>;
  defaultAccount$: Observable<string | undefined>;

  getContractInfo: (nameOrAddress: string) => Observable<ContractInfo>;
}


export interface InputDefinition {
  indexed: boolean;
  name: string;
  type: string;
}

export interface EventDefintion {
  anonymous: boolean;
  inputs: InputDefinition[];
  name: string;
  type: "event";
}

export interface NetworkDefinition {
  address: string;
  events: { [topic: string]: EventDefintion };
  links: {};
  updated_at: number;
}

export interface TruffleJson {
  contract_name: string;
  abi: Web3.ContractAbi;
  unlinked_binary: string;
  networks: { [id: string]: NetworkDefinition };
}

export interface TransactionInfo {
  contractName: string;
  address: string;
  method: string;
  txParams: any;
  args: any;
  tx: string;
}

export interface TransactionWithHash extends TransactionInfo {
  status: "pending";
}
export interface FailedTransaction extends TransactionInfo {
  error: string;
  status: "failed";
}
export interface ConfirmedTransaction extends TransactionInfo {
  status: "confirmed";
  receipt: any;
}

export type Transaction =
  | TransactionWithHash
  | FailedTransaction
  | ConfirmedTransaction;

export type TransactionResult<T> = Observable<Transaction>;
export type CallResult<T> = Observable<T>;

export interface ContractInfo {
  address: string;
  name: string;
  genesisBlock: number;
  abi: Web3.AbiDefinition[];
}

export interface EthProxyInterceptors {
  call: (obs: Observable<any>) => any;
  transaction: (obs: Observable<any>) => any;
  preQuery: (obs: Observable<any>) => any;
  postQuery: (obs: Observable<any>) => any;
}

export interface EthProxyOptions {
  pollInterval: number;
  eventReader: (web3: Web3, options: Web3.FilterObject) => Observable<any[]>;
  store: {
    dispatch: Function
  },
  interceptors: Partial<EthProxyInterceptors>;
}

export type BlockRange = [number, number];

export interface QueryArgs {
  address: string;
  range: BlockRange;
}

export interface QueryResult {
  address: string;
  range: [number, number];
  events: any[];
}

export interface QueryModel<T extends {} = {}> {
  name: string;
  deps: {
    [P in keyof Partial<T>]:
      | {
          [eventName: string]:
            | {
                [inputName: string]: any;
              }
            | "*";
        }
      | "*"
  };
}

export interface Web3Provider {
  sendAsync: Function;
}

export interface TransationHashEvent {
  type: "tx";
  value: string;
}
export interface TransactionConfirmation<T> {
  logs: T[];
  receipt: any;
  tx: string;
}
export interface TransationConfirmationEvent<T> {
  type: "confirmation";
  value: TransactionConfirmation<T>;
}
export type TransationResultEvent<T> =
  | TransationHashEvent
  | TransationConfirmationEvent<T>;

export type ObservableTransactionResult<T> = Observable<
  TransationResultEvent<T>
>;

export interface ContractDefaults {
  from?: string;
  gas?: string;
  gasPrice?: string;
  value?: string;
}

export type NameRef<T extends string> = T;
export interface InterfaceRef<T extends string> {
  interface: T;
  address: string;
}

export type ContractRef<T extends string = string> =
  | NameRef<T>
  | InterfaceRef<T>;

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

export interface Provider {
  sendAsync: any;
}

export interface EventMetadata {
  address: string;
  logIndex: number;
  transactionHash: string;
  transactionIndex: number;
  type: string;
  blockHash: string;
  blockNumber: number;
}
