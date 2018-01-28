import * as Web3 from 'web3';
import { Observable } from 'rxjs/Observable';
import { BlockchainEvent } from './events';
import { BigNumber } from 'bignumber.js';

export interface TransactionInfo {
  contractName: string;
  address: string;
  method: string;
  txParams: any;
  args: any;
  initId?: string;
}

export interface InitializedTransaction extends TransactionInfo {
  status: 'init';
}
export interface TransactionWithHash extends TransactionInfo {
  tx: string;
  status: 'tx';
}
export interface FailedTransaction extends TransactionInfo {
  tx: string;
  error: string;
  status: 'failed';
}
export interface ConfirmedTransaction extends TransactionInfo {
  tx: string;
  status: 'confirmed';
  receipt: Web3.TransactionReceipt;
  logs: BlockchainEvent[];
}

export type Transaction =
  | InitializedTransaction
  | TransactionWithHash
  | FailedTransaction
  | ConfirmedTransaction;

export interface TransationHashEvent {
  type: 'tx';
  value: string;
}
export interface TransactionConfirmation<T> {
  logs: T[];
  receipt: Web3.TransactionReceipt;
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

export enum TransactionResultCode {
  Failure = 0,
  Success = 1
}

export type TransactionResult<T> = Observable<Transaction>;
export type CallResult<T> = Observable<T>;

export interface RequestOptions {
  gas?: number | string | BigNumber;
  gasPrice?: number | string | BigNumber;
  value?: number | string | BigNumber;
  from?: string;
  address?: string;
}

export interface RequestWithoutPayload<I extends string, M extends string>
  extends RequestOptions {
  interface: I;
  method: M;
}

export interface Request<I extends string, M extends string, P>
  extends RequestOptions {
  interface: I;
  method: M;
  payload: P;
}

export type ObjHas<Obj extends {}, K extends string> = ({
  [K in keyof Obj]: '1'
} & {
  [k: string]: '0';
})[K];

export type CreateRequestWithPayload<C extends string, M extends string, P> = (
  payload: P
) => Request<C, M, P>;

export type CreateRequestWithoutPayload<
  C extends string,
  M extends string
> = () => Request<C, M, never>;

export type CreateRequest<
  T extends ContractsAggregation<any>,
  C extends string,
  M extends string
> = {
  1: CreateRequestWithPayload<C, M, T[C][M]['in']>;
  0: CreateRequestWithoutPayload<C, M>;
}[ObjHas<T[C][M], 'in'>];

export type RequestFactory<T extends {}> = {
  [C in keyof T]: { [M in keyof T[C]]: CreateRequest<T, C, M> }
};

export type ContractDefinition<T> = {
  [M in keyof T]: {
    in?: any;
    out: any;
    events: any;
  }
};

export type ContractsAggregation<T extends {}> = {
  [I in keyof T]: ContractDefinition<T[I]>
};

export class RequestHandlers<T extends {}> {
  ethCall: <I extends keyof T, M extends keyof T[I]>(
    request: Request<I, M, T[I][M]['in']>
  ) => CallResult<T[I][M]['out']>;

  transaction: <I extends keyof T, M extends keyof T[I], V extends T[I][M]>(
    request: Request<I, M, T[I][M]['in']>
  ) => TransactionResult<T[I][M]['events']>;
}
