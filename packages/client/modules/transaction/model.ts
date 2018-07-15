import { Observable } from 'rxjs';
import { TransactionReceipt } from '@eth-proxy/rx-web3';
import { Request } from '../request';
import { DecodedEvent } from '../events';

export interface TransactionInfo {
  contractName: string;
  address: string;
  method: string;
  txParams: any;
  args: any;
  initId: string;
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
  receipt: TransactionReceipt;
  logs: DecodedEvent[];
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
  receipt: TransactionReceipt;
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

export type TransactionHandler<T> = <
  I extends Extract<keyof T, string>,
  M extends Extract<keyof T[I], string>,
  V extends T[I][M]
>(
  request: Request<I, M, T[I][M] extends { in: infer In } ? In : never>
) => TransactionResult<
  T[I][M] extends { events: infer Events } ? Events : never
>;
