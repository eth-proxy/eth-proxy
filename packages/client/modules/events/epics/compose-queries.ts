import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { mergeMap, first, map as rxMap, map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { keys, isNil, chain } from 'ramda';

import {
  COMPOSE_QUERY_FROM_MODEL,
  ComposeQueryFromModel,
  queryEvents,
  Types as ActionTypes
} from '../actions';
import { getLatestBlockNumberOrFail } from '../../blocks';
import { EpicContext } from '../../../context';
import { BlockRange } from '../model';
import { depsToTopics } from '../utils/expand-model';
import { splitQueryByTopics, toTopicList } from '../utils';
import { State } from '../../../store';
import { arrify } from '../../../utils';

export const composeQueries = (
  actions$: ActionsObservable<ActionTypes>,
  state$: StateObservable<State>,
  { contractLoader }: EpicContext
): Observable<ActionTypes> =>
  actions$.pipe(
    ofType(COMPOSE_QUERY_FROM_MODEL),
    mergeMap(({ payload: { id, model } }: ComposeQueryFromModel) => {
      return forkJoin(keys(model.deps).map(contractLoader)).pipe(
        mergeMap(contracts => {
          return state$
            .pipe(
              rxMap(getLatestBlockNumberOrFail),
              first(x => !isNil(x))
            )
            .pipe(
              map(latestBlockNumber => {
                const queries = contracts.map(
                  ({ address, genesisBlock, abi, name }) => {
                    const rangeStart = Math.max(
                      model.fromBlock || 0,
                      genesisBlock || 0
                    );
                    const queryAddress = model.addresses[name] || address;
                    if (isNil(queryAddress)) {
                      throw Error('Query address not found');
                    }

                    return {
                      range: [rangeStart, latestBlockNumber] as BlockRange,
                      topics: depsToTopics(abi, model.deps[name]),
                      address: arrify(queryAddress)
                    };
                  }
                );

                const queryByTopics = chain(splitQueryByTopics, queries);
                const filters = queryByTopics.map(
                  ({ range: [fromBlock, toBlock], address, topics }) => ({
                    toBlock,
                    fromBlock,
                    address,
                    topics: toTopicList(topics)
                  })
                );

                return queryEvents({
                  id,
                  queries,
                  filters
                });
              })
            );
        })
      );
    })
  );
