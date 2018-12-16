import { RpcResponse, RpcRequest, RpcMethod } from '../interfaces';
import { Observable } from 'rxjs';

export type RpcRequestHandler = <
  P extends RpcRequest,
  Type extends P['method']
>(
  payload: P
) => Observable<Extract<RpcMethod, { type: Type }>['response']>;

export type MiddlewareItem = (
  payload: RpcRequest,
  next: RpcRequestHandler
) => Observable<RpcResponse>;
