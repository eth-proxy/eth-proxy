import { F } from 'ts-toolbelt';
import { RpcMethod, RpcRequest } from './rpc-methods';
import { Observable } from 'rxjs';
import { BigNumber } from 'bignumber.js';

export type ProviderBound<T> = T extends (provider: Provider) => infer Result
  ? () => Result
  : T extends F.Curry<(p: Provider, a: infer A1) => infer Result>
  ? (arg: A1) => Result
  : never;

export type RpcSend = <
  Request extends RpcRequest,
  Type extends Request['method']
>(
  payload: Request | Request[]
) => Promise<Extract<RpcMethod, { type: Type }>['response']>;

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

export type SendObservableRequest = <
  Request extends RpcRequest,
  Type extends Request['method']
>(
  payload: Request | Request[]
) => Observable<Extract<RpcMethod, { type: Type }>['response']['result']>;

export type SendRequest = <
  Request extends RpcRequest,
  Type extends Request['method']
>(
  payload: Request | Request[]
) => Promise<Extract<RpcMethod, { type: Type }>['response']['result']>;

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
  args?: NewHeadsOptions;
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
