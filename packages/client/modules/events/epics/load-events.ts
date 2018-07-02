import { forkJoin, of, Observable } from 'rxjs';
import {
  map as rxMap,
  catchError,
  mergeMap,
  tap,
  first,
  defaultIfEmpty
} from 'rxjs/operators';
import { chain, isEmpty } from 'ramda';
import { ActionsObservable, StateObservable, ofType } from 'redux-observable';

import {
  createQueryEventsSuccess,
  createQueryEventsFailed,
  QUERY_EVENTS,
  QueryEvents,
  QueryEventsFailed,
  QueryEventsSuccess
} from '../actions';
import { EpicContext } from '../../../context';
import {
  createEventCache,
  getFiltersToLoad,
  getEventsForFilter
} from '../cache';
import * as fromSchema from '../../schema';
import { State } from '../../../store';

export const queryEvents = (
  action$: ActionsObservable<QueryEvents>,
  state$: StateObservable<State>,
  { getEvents }: EpicContext
) => {
  const cache = createEventCache();

  return action$.pipe(
    ofType(QUERY_EVENTS),
    mergeMap(({ payload: { filters, id } }) => {
      const loadAll$ = of(...filters).pipe(
        mergeMap(f => getFiltersToLoad(cache.getState(), f)),
        tap(cache.request),
        mergeMap(f =>
          getEvents(f).pipe(
            tap({
              next: cache.result(f),
              error: cache.error(f)
            })
          )
        ),
        defaultIfEmpty([])
      );

      const pendingLoaded$ = cache
        .select(state =>
          filters.every(f => isEmpty(getFiltersToLoad(state, f)))
        )
        .pipe(first());

      return forkJoin(loadAll$, pendingLoaded$, of(null))
        .pipe(
          mergeMap(() =>
            cache.select(state =>
              chain(f => getEventsForFilter(f, state), filters)
            )
          ),
          first(),
          rxMap(fromSchema.getLogDecoder(state$.value))
        )
        .pipe(
          rxMap(events => createQueryEventsSuccess({ id, events })),
          catchError(err => {
            console.error(err);
            return of(createQueryEventsFailed(id));
          })
        );
    })
  );
};
