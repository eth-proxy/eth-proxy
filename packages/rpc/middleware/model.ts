import { RpcRequest, RpcResponses } from '../interfaces';
import { Observable } from 'rxjs';

export type RpcRequestHandler = <R extends RpcRequest | RpcRequest[]>(
  payload: R
) => Observable<RpcResponses<R>>;

export type MiddlewareItem = <R extends RpcRequest | RpcRequest[]>(
  payload: R,
  next: RpcRequestHandler
) => Observable<RpcResponses<R>>;
