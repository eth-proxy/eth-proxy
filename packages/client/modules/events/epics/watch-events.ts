import { catchError, takeUntil, mergeMap, filter, map } from 'rxjs/operators';
import { ActionsObservable, StateObservable, ofType } from 'redux-observable';
import {
  AddEventsWatch,
  createEventsLoaded,
  ADD_EVENTS_WATCH,
  REMOVE_EVENTS_WATCH,
  RemoveEventsWatch
} from '../actions';

import { Observable } from 'rxjs';
import { EpicContext } from '../../../context';
import * as fromSchema from '../../schema';

// DONT WATCH SAME CONTRACTS MORE THEN ONCE
export const watchEvents = (
  action$: ActionsObservable<any>,
  state$: StateObservable<any>,
  { watchEvents }: EpicContext
) => {
  const takeUnilRemoved = (id: string) =>
    takeUntil(
      action$.pipe(
        ofType(REMOVE_EVENTS_WATCH),
        filter(({ payload }: RemoveEventsWatch) => payload === id)
      )
    );

  return action$.pipe(
    ofType(ADD_EVENTS_WATCH),
    mergeMap(({ payload: { addresses, fromBlock, id } }: AddEventsWatch) => {
      return watchEvents({
        fromBlock,
        address: addresses
      }).pipe(
        takeUnilRemoved(id),
        map(log => fromSchema.getLogDecoder(state$.value)([log])),
        map(createEventsLoaded),
        catchError((err, err$) => {
          console.error(err);
          return err$;
        })
      );
    })
  );
};
