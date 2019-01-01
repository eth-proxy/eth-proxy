import { forkJoin, Observable } from 'rxjs';
import { MiddlewareItem, RpcRequestHandler } from './model';
import { RpcRequest, RpcResponses } from '../interfaces';
import { isBatch, isSingleReq } from '../utils';

export type SingleRequestMiddleware<R extends RpcRequest = RpcRequest> = (
  payload: R,
  next: RpcRequestHandler
) => Observable<RpcResponses<R>>;

export function forEachRequest(
  middleware: SingleRequestMiddleware
): MiddlewareItem {
  return (payload, next) => {
    if (isSingleReq(payload)) {
      return middleware(payload, next) as any;
    }
    if (isBatch(payload)) {
      // Should handle each of them not skip
      // return forkJoin(payload.map(req => middleware(req, next)));
      return next(payload);
    }
  };
}
