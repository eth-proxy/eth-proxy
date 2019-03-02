import { MiddlewareItem } from '@eth-proxy/rpc';
import { SubscribableOrPromise, defer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { lensPath, set } from 'ramda';

export function defaultAccountMiddleware(
  getFrom: () => SubscribableOrPromise<string>
): MiddlewareItem {
  const fromLens = lensPath(['params', 0, 'from']);

  return (request, next) => {
    if (request.method !== 'eth_sendTransaction' || request.params[0].from) {
      return next(request);
    }

    return defer(getFrom).pipe(
      map(from => {
        return set(fromLens, from, request);
      }),
      mergeMap(next)
    );
  };
}
