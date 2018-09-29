import { Observable } from 'rxjs';
import { CurriedFunction2 } from 'ramda';
import { RpcMethod, RpcRequest } from './json-rpc';

export type ProviderBound<T> = T extends (
  provider: Provider
) => Observable<infer R>
  ? () => Observable<R>
  : T extends CurriedFunction2<Provider, infer A1, Observable<infer R>>
    ? (arg: A1) => Observable<R>
    : never;

export type SendAsync = <
  Request extends RpcRequest,
  Type extends Request['method']
>(
  payload: Request | Request[],
  cb: (err: any, next: Extract<RpcMethod, { type: Type }>['response']) => void
) => void;

export type Provider = {
  sendAsync: SendAsync;
};

export type SendRequest = <
  Request extends RpcRequest,
  Type extends Request['method']
>(
  payload: Request | Request[]
) => Observable<Extract<RpcMethod, { type: Type }>['response']>;

export interface FilterObject {
  fromBlock?: number | string;
  toBlock?: number | string;
  address?: string | string[];
  topics?: string[] | string[][];
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

export * from './abi';
export * from './entities';
export * from './json-rpc';
export * from './raw-entities';
