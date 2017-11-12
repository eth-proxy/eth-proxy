import * as Web3 from "web3";
import { Observable } from "rxjs/Observable";

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
  address: string;
  from: string;
  method: string;
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
export type CallResult<T> = Promise<T>;

export interface ContractInfo {
  address: string;
  name: string;
  genesisBlock: number;
  abi: Web3.AbiDefinition[];
}

export interface EthProxyOptions {
  pollInterval: number;
  eventReader: (web3: Web3, options: Web3.FilterObject) => Observable<any[]>;
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

export interface QueryModel {
  name: string;
  deps: {
    [contractName: string]: {
      [eventName: string]: {
        [inputName: string]: any;
      } | '*';
    } | '*';
  };
}

export interface Web3Provider {
  sendAsync: Function;
}

export interface TransationHashEvent {
  type: 'tx';
  value: string;
}
export interface TransactionConfirmation<T> {
  logs: T[];
  receipt: any;
  tx: string;
}
export interface TransationConfirmationEvent<T> {
  type: 'confirmation';
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

declare module 'rxjs/Observable' {
  // tslint:disable-next-line:interface-name no-shadowed-variable
  interface Observable<T> {
    once(this: Observable<any>, type: "tx", fn: Function): Observable<T>
    on(this: Observable<any>, type: "confirmation", fn: Function): Observable<T>
  }
}

export type NameRef<T extends string> = T;
export type InterfaceRef<T extends string> = {
  name: T;
  interface: string;
};

export type ContractRef<T extends string = string> = NameRef<T> | InterfaceRef<T>