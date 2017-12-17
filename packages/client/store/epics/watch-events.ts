import {
  withLatestFrom,
  catchError,
  takeUntil,
  mergeMap,
  filter
} from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { ActionsObservable } from 'redux-observable';

import { EpicContext } from '../model';
import {
  AddEventsWatch,
  createEventsLoaded,
  ADD_EVENTS_WATCH,
  REMOVE_EVENTS_WATCH,
  RemoveEventsWatch
} from '../actions';
import { getLogDecoder } from '../selectors';

import { Observable } from 'rxjs/Observable';

// DONT WATCH SAME CONTRACTS MORE THEN ONCE
export const watchEvents = (
  action$: ActionsObservable<any>,
  store,
  { watchEvents }: EpicContext
) => {
  const takeUnilRemoved = (id: number) =>
    takeUntil(
      action$
        .ofType(REMOVE_EVENTS_WATCH)
        .let(filter(({ payload }: RemoveEventsWatch) => payload === id))
    );

  return action$.ofType(ADD_EVENTS_WATCH).pipe(
    mergeMap(({ payload: { addresses, fromBlock, id } }: AddEventsWatch) => {
      return watchEvents({
        fromBlock,
        address: addresses
      }).pipe(
        takeUnilRemoved(id),
        map(log => getLogDecoder(store.getState())([log])),
        map(createEventsLoaded),
        catchError((err, err$) => {
          console.error(err);
          return err$;
        })
      );
    })
  );
};
