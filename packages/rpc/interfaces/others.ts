import { CurriedFunction2 } from 'ramda';
import { RpcMethod, RpcRequest } from './rpc-methods';
import { Observable } from 'rxjs';
import { BigNumber } from 'bignumber.js';

export type ProviderBound<T> = T extends (provider: Provider) => infer Result
  ? () => Result
  : T extends CurriedFunction2<Provider, infer A1, infer Result>
  ? (arg: A1) => Result
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
) => Promise<Extract<RpcMethod, { type: Type }>['response']['result']>;

export type SendObservableRequest = <
  Request extends RpcRequest,
  Type extends Request['method']
>(
  payload: Request | Request[]
) => Observable<Extract<RpcMethod, { type: Type }>['response']['result']>;

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
