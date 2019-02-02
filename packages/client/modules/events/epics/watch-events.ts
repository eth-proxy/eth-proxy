import { takeUntil, mergeMap, filter, map } from 'rxjs/operators';
import { ActionsObservable, StateObservable } from 'redux-observable';
import * as actions from '../actions';

import { merge, EMPTY, Observable } from 'rxjs';
import { EpicContext } from 'client/context';
import * as fromSchema from '../../schema';
import { subscribeLogs, decodeLogs } from '@eth-proxy/rpc';
import { ofType } from 'client/utils';

// DONT WATCH SAME CONTRACTS MORE THEN ONCE
export const watchEvents = (
  action$: ActionsObservable<actions.Types>,
  state$: StateObservable<any>,
  { provider, options }: EpicContext
): Observable<actions.Types> => {
  if (!options.subscribeLogs) {
    return EMPTY;
  }

  return action$.pipe(
    ofType(actions.QUERY_EVENTS),
    mergeMap(({ payload: { id, filters } }) => {
      return merge(
        ...filters.map(f => {
          return subscribeLogs(provider, {
            address: f.address,
            topics: f.topics
          });
        })
      ).pipe(
        takeUntil(
          action$.pipe(
            ofType(actions.QUERY_UNSUBSCRIBE),
            filter(({ payload }) => payload === id)
          )
        ),
        map(x => [x]),
        map(decodeLogs(fromSchema.getAllAbis(state$.value))),
        map(actions.eventsLoaded)
      );
    })
  );
};
