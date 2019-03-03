import { MiddlewareItem } from '@eth-proxy/rpc';
import { pick } from 'ramda';
import { BehaviorSubject } from 'rxjs';
import { dataOf, getLoadedValue } from 'client/utils';
import { Data, ClientRequest, ClientResponse } from 'client/interfaces';
import { tap, map, first } from 'rxjs/operators';
import { LOADING } from 'client/constants';
import { isCacheable } from './is-cacheable';

interface State {
  [requestHash: string]: Data<ClientResponse>;
}

interface CacheOptions {
  isCacheable: (payload: ClientRequest) => boolean;
}

export function cacheMiddleware(
  options: CacheOptions = { isCacheable }
): MiddlewareItem {
  const state$ = new BehaviorSubject<State>({});

  return (payload, handle) => {
    if (!options.isCacheable(payload)) {
      return handle(payload);
    }
    const hash = requestHash(payload);

    if (state$.value[hash]) {
      return state$.pipe(
        map(state => state[hash]),
        getLoadedValue(),
        first()
      );
    }

    state$.next({
      ...state$.value,
      [hash]: LOADING
    });

    return handle(payload).pipe(
      tap(response => {
        state$.next({
          ...state$.value,
          [hash]: dataOf(response)
        });
      })
    );
  };
}

function requestHash(payload: ClientRequest) {
  return JSON.stringify(pick(['method', 'params'], payload));
}
