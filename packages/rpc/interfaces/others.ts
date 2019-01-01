import { CurriedFunction2 } from 'ramda';
import { RpcRequest, RpcResponses, RpcResults } from './rpc-methods';
import { Observable } from 'rxjs';
import { BigNumber } from 'bignumber.js';

export type ProviderBound<T> = T extends (provider: Provider) => infer Result
  ? () => Result
  : T extends CurriedFunction2<Provider, infer A1, infer Result>
  ? (arg: A1) => Result
  : never;

export type RpcSend = <R extends RpcRequest | RpcRequest[]>(
  payload: R
) => Promise<RpcResponses<R>>;

export interface LegacyProvider {
  sendAsync: (payload: any, cb: any) => void;
}

export interface Provider {
  send: RpcSend;
  observe: (subscriptionId: string) => Observable<any>;
  disconnect: () => void;
}

export interface Subprovider extends Provider {
  accept: (req: RpcRequest) => boolean;
}

export type SendObservableRequest = <R extends RpcRequest | RpcRequest[]>(
  payload: R
) => Observable<RpcResults<R>>;

export type SendRequest = <R extends RpcRequest | RpcRequest[]>(
  payload: R
) => Promise<RpcResults<R>>;

export interface FilterObject {
  fromBlock?: number | string;
  toBlock?: number | string;
  address?: string | string[];
  topics?: (string | string[])[];
}

export type NumberLike = string | number | BigNumber;

export interface RequestInputParams {
  from?: string;
  to?: string;
  gas?: NumberLike;
  gasPrice?: NumberLike;
  value?: NumberLike;
  data?: string;
}

export interface LogFilter {
  address?: string | string[];
  topics?: (string | string[])[];
}

export interface NewHeadsOptions {
  includeTransactions?: boolean;
}

export interface NewHeadsArgs {
  type: 'newHeads';
  args: NewHeadsOptions;
}

export interface LogsArgs {
  type: 'logs';
  args: LogFilter;
}

export interface NewPendingTransactionsArgs {
  type: 'newPendingTransactions';
}

export interface SyncingArgs {
  type: 'syncing';
}

export type SubscribeArgs =
  | NewHeadsArgs
  | LogsArgs
  | NewPendingTransactionsArgs
  | SyncingArgs;

export type Omit<T, K extends string> = Pick<T, Exclude<keyof T, K>>;

export type Batch<R extends RpcRequest | RpcRequest[]> = Extract<
  R,
  RpcRequest[]
>;
