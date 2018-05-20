import { ActionsObservable, ofType } from 'redux-observable';
import { mergeMap, first, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { QueryArgs } from '../model';
import * as actions from '../actions';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { keys, isNil } from 'ramda';
import { _throw } from 'rxjs/observable/throw';
import { EpicContext } from '../../../context';
import { getLatestBlockNumberOrFail, getEventQueries } from '../../../store';
import { createQueries } from '../create-queries';

export const composeQueries = (
  actions$: ActionsObservable<actions.Types>,
  _,
  { state$, contractLoader }: EpicContext
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
