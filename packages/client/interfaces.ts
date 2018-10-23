import { RpcCall } from '@eth-proxy/rx-web3';
import { Observable } from 'rxjs';

export type ObjKey = string | number | symbol;
export type NumberLike = number | string | BigNumber;

export type Data<T> = DataNotAsked | DataLoading | DataLoaded<T> | DataError;

export interface DataNotAsked {
  status: 'NotAsked';
}

export interface DataLoading {
  status: 'Loading';
}

export interface DataLoaded<T> {
  status: 'Loaded';
  value: T;
}

export interface DataError {
  status: 'Error';
  value: any;
}

export type LiftRpc = <Method extends RpcCall>(
  method: Method
) => Method extends RpcCall<infer T> ? Observable<T> : never;
