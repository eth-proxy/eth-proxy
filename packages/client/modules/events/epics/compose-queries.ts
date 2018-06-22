import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { mergeMap, first, map } from 'rxjs/operators';
import {
  of,
  combineLatest,
  Observable,
  forkJoin,
  throwError as _throw
} from 'rxjs';
import { keys, isNil } from 'ramda';

import { QueryArgs } from '../model';
import * as actions from '../actions';
import { getEventQueries } from '../reducer';
import { EpicContext } from '../../../context';
import { createQueries } from '../create-queries';
import { getLatestBlockNumberOrFail } from '../../blocks';
import { State } from '../../../store';

export const composeQueries = (
  actions$: ActionsObservable<actions.Types>,
  state$: StateObservable<State>,
  { contractLoader }: EpicContext
): Observable<actions.Types> =>
  actions$.pipe(
    ofType<actions.ComposeQueryFromModel>(actions.COMPOSE_QUERY_FROM_MODEL),
    mergeMap(({ payload: { id, model } }) => {
      return combineLatest(
        of(id),
        forkJoin(keys(model.deps).map(contractLoader)),
        state$.pipe(map(getLatestBlockNumberOrFail)),
        // was with latest from?
        state$.pipe(map(getEventQueries))
      ).pipe(first(args => args.every(x => x !== undefined)));
    }),
    mergeMap(([id, contracts, latestBlockNumber, queries]) => {
      const toQuery = createQueries({
        contracts,
        latestBlockNumber,
        queries
      });
      if (toQuery.some(x => isNil(x.address))) {
        return _throw('Address is not defined');
      }

      const queryEventsAction = actions.createQueryEvents(toQuery);

      return [
        queryEventsAction,
        actions.createAddEventsWatch({
          id,
          addresses: toQuery.map(x => x.address),
          fromBlock: latestBlockNumber
        })
      ];
    })
  );
