import { catchError, takeUntil, mergeMap, filter, map } from 'rxjs/operators';
import { ActionsObservable, StateObservable, ofType } from 'redux-observable';
import * as actions from '../actions';

import { merge, EMPTY } from 'rxjs';
import { EpicContext } from '../../../context';
import * as fromSchema from '../../schema';
import { watchLogs } from '@eth-proxy/rpc';

// DONT WATCH SAME CONTRACTS MORE THEN ONCE
export const watchEvents = (
  action$: ActionsObservable<actions.Types>,
  state$: StateObservable<any>,
  { provider, options }: EpicContext
) => {
  if (!options.watchLogsTimer$) {
    return EMPTY;
  }
  const takeUnilRemoved = (id: string) =>
    takeUntil(
      action$.pipe(
        ofType(actions.QUERY_UNSUBSCRIBE),
        filter(({ payload }: actions.QueryUnsubscribe) => payload === id)
      )
    );

  return action$.pipe(
    ofType(actions.QUERY_EVENTS),
    mergeMap(({ payload: { id, filters } }: actions.QueryEvents) => {
      return merge(
        ...filters.map(f =>
          watchLogs(provider, {
            filter: {
              fromBlock: f.toBlock,
              address: f.address,
              topics: f.topics
            },
            timer$: options.watchLogsTimer$
          })
        )
      ).pipe(
        takeUnilRemoved(id),
        map(log => fromSchema.getLogDecoder(state$.value)([log])),
        map(actions.eventsLoaded),
        catchError((err, err$) => err$)
      );
    })
  );
};
