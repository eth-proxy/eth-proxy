import { forkJoin, of } from 'rxjs';
import {
  map as rxMap,
  catchError,
  mergeMap,
  tap,
  first,
  defaultIfEmpty
} from 'rxjs/operators';
import { chain, isEmpty } from 'ramda';
import { ActionsObservable, StateObservable } from 'redux-observable';

import {
  queryEventsSuccess,
  queryEventsFailed,
  QUERY_EVENTS,
  QueryEvents
} from '../actions';
import { EpicContext } from '@eth-proxy/client/context';
import {
  createEventCache,
  getFiltersToLoad,
  getFiltersLoaded,
  getEventsForFilter
} from '../cache';
import * as fromSchema from '../../schema';
import { State } from '@eth-proxy/client/store';
import { getEvents, decodeLogs } from '@eth-proxy/rpc';
import { ofType } from '@eth-proxy/client/utils';

export const queryEventsEpic = (
  action$: ActionsObservable<QueryEvents>,
  state$: StateObservable<State>,
  { provider }: EpicContext
) => {
  const cache = createEventCache();

  return action$.pipe(
    ofType(QUERY_EVENTS),
    mergeMap(({ payload: { filters, id } }) => {
      const loadAll$ = of(...filters).pipe(
        mergeMap(f => getFiltersToLoad(cache.getState(), f)),
        tap(cache.request),
        mergeMap(f => {
          return getEvents(provider, f)
            .then(cache.result(f))
            .catch(cache.error(f));
        }),
        defaultIfEmpty()
      );

      const pendingLoaded$ = cache
        .select(state =>
          filters.every(f => isEmpty(getFiltersLoaded(state, f)))
        )
        .pipe(first(x => !!x));

      return forkJoin(loadAll$, pendingLoaded$, of(null))
        .pipe(
          mergeMap(() =>
            cache.select(state =>
              chain(f => getEventsForFilter(f, state), filters)
            )
          ),
          first(),
          rxMap(decodeLogs(fromSchema.getAllAbis(state$.value)))
        )
        .pipe(
          rxMap(events => queryEventsSuccess({ id, events })),
          catchError(() => of(queryEventsFailed(id)))
        );
    })
  );
};
