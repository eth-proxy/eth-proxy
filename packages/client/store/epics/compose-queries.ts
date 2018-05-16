import { ActionsObservable, ofType } from 'redux-observable';
import { mergeMap, first, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { EpicContext, QueryArgs, ContractInfo } from '../model';
import {
  COMPOSE_QUERY_FROM_MODEL,
  ComposeQueryFromModel,
  createAddEventsWatch,
  createQueryEvents
} from '../actions';
import { getContractsFromModel$ } from '../rx-selectors';
import { getLatestBlockNumberOrFail, getEventQueries } from '../selectors';
import { createQueries } from '../../modules/query/create-queries';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { keys, isNil } from 'ramda';
import { _throw } from 'rxjs/observable/throw';

export const composeQueries = (
  actions$: ActionsObservable<any>,
  _,
  { state$, contractLoader }: EpicContext
) =>
  actions$.pipe(
    ofType(COMPOSE_QUERY_FROM_MODEL),
    mergeMap(({ payload: { id, model } }: ComposeQueryFromModel) => {
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

      const queryEventsAction = createQueryEvents(toQuery);

      return [
        queryEventsAction,
        createAddEventsWatch({
          id,
          addresses: toQuery.map(x => x.address),
          fromBlock: latestBlockNumber
        })
      ];
    })
  );
