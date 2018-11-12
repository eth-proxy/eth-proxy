import { RpcResponse } from '../interfaces';
import { Observable } from 'rxjs';
import { Payload, Handler } from '../providers/model';

export type MiddlewareItem = (
  payload: Payload,
  next: Handler
) => Observable<RpcResponse>;
