import { Observable } from 'rxjs';
import { TransactionReceipt, NumberLike, DecodedEvent } from '@eth-proxy/rpc';
import { Request } from '../request';

export interface TransactionInfo<T = any> {
  contractName: string;
  address: string;
  method: string;
  txParams: any;
  args: T;
  initId: string;
}

export interface InitializedTransaction<T = any> extends TransactionInfo<T> {
  status: 'init';
}
export interface TransactionWithHash<T = any> extends TransactionInfo<T> {
  tx: string;
  status: 'tx';
}
export interface FailedTransaction<T = any> extends TransactionInfo<T> {
  tx: string;
  error: string;
  status: 'failed';
}
export interface ConfirmedTransaction<T = any> extends TransactionInfo<T> {
  tx: string;
  status: 'confirmed';
  receipt: TransactionReceipt;
  logs: DecodedEvent[];
}

export type Transaction<T = any> =
  | InitializedTransaction<T>
  | TransactionWithHash<T>
  | FailedTransaction<T>
  | ConfirmedTransaction<T>;

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

export type TransactionResult<T> = Observable<Transaction<T>>;

export type TransactionHandler<T> = <
  I extends Extract<keyof T, string>,
  M extends Extract<keyof T[I], string>
>(
  request: Request<I, M, T[I][M] extends { in: infer In } ? In : never>
) => TransactionResult<
  T[I][M] extends { events: infer Events } ? Events : never
>;

export interface DeploymentInput<I extends string, P> {
  interface: I;
  payload: P;
  gas?: NumberLike;
  gasPrice?: NumberLike;
  value?: NumberLike;
  from?: string;
}
