import { catchError, takeUntil, mergeMap, filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { ActionsObservable } from 'redux-observable';
import {
  AddEventsWatch,
  createEventsLoaded,
  ADD_EVENTS_WATCH,
  REMOVE_EVENTS_WATCH,
  RemoveEventsWatch
} from '../actions';

import { Observable } from 'rxjs/Observable';
import { EpicContext } from '../../../context';
import * as fromSchema from '../../schema';

// DONT WATCH SAME CONTRACTS MORE THEN ONCE
export const watchEvents = (
  action$: ActionsObservable<any>,
  store,
  { watchEvents }: EpicContext
) => {
  const takeUnilRemoved = (id: string) =>
    takeUntil(
      action$
        .ofType(REMOVE_EVENTS_WATCH)
        .pipe(filter(({ payload }: RemoveEventsWatch) => payload === id))
    );

  return action$.ofType(ADD_EVENTS_WATCH).pipe(
    mergeMap(({ payload: { addresses, fromBlock, id } }: AddEventsWatch) => {
      return watchEvents({
        fromBlock,
        address: addresses
      }).pipe(
        takeUnilRemoved(id),
        map(log => fromSchema.getLogDecoder(store.getState())([log])),
        map(createEventsLoaded),
        catchError((err, err$) => {
          console.error(err);
          return err$;
        })
      );
    })
  );
};
