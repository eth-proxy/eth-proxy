import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { MiddlewareItem, RpcRequestHandler } from './model';
import { RpcRequest, RpcResponses } from '../interfaces';
import { isBatch, isSingleReq } from '../utils';
import { mergeMap, map, share, first, tap } from 'rxjs/operators';
import { update } from 'ramda';

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
      let resolvedCount = 0;
      const request$ = new BehaviorSubject<RpcRequest[]>(
        new Array(payload.length)
      );

      const result$ = request$.pipe(
        first(() => resolvedCount === payload.length),
        mergeMap(next),
        share()
      );

      return forkJoin(
        ...payload.map((req, index) => {
          const resolved = () => resolvedCount++;

          const itemResult$ = middleware(req, innerPayload => {
            resolved();

            request$.next(
              update(index, innerPayload as RpcRequest, request$.value)
            );

            return result$.pipe(map(x => x[index])) as Observable<any>;
          });

          return itemResult$.pipe(tap(resolved));
        })
      );
    }
  };
}
