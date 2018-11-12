import { RpcRequest, RpcResponse, RpcMethod } from '../interfaces';
import { Observable } from 'rxjs';

export type Payload = RpcRequest;
export type Handler = <P extends Payload, Type extends P['method']>(
  payload: P
) => Observable<Extract<RpcMethod, { type: Type }>['response']>;

export type SubHandler = {
  [method: string]: Handler;
};
