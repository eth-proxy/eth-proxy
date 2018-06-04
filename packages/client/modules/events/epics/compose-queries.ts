import { ActionsObservable, ofType } from 'redux-observable';
import { mergeMap, first, map as rxMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { keys, isNil, chain } from 'ramda';

import {
  COMPOSE_QUERY_FROM_MODEL,
  ComposeQueryFromModel,
  createAddEventsWatch,
  createQueryEvents
} from '../actions';
import { getLatestBlockNumberOrFail } from '../../blocks';
import { Observable } from 'rxjs/Observable';
import { EpicContext } from '../../../context';
import { BlockRange, NormalizedFilter, ContractQuery } from '../model';
import { depsToTopics } from '../utils/expand-model';
import { splitQueryByTopics, toTopicList } from '../utils';

export const composeQueries = (
  actions$: ActionsObservable<any>,
  _,
  { state$, contractLoader }: EpicContext
) =>
  actions$.pipe(
    ofType(COMPOSE_QUERY_FROM_MODEL),
    mergeMap(({ payload: { id, model } }: ComposeQueryFromModel) => {
      return forkJoin(keys(model.deps).map(contractLoader)).pipe(
        mergeMap(contracts => {
          return state$
            .pipe(rxMap(getLatestBlockNumberOrFail), first(x => !isNil(x)))
            .pipe(
              mergeMap(latestBlockNumber => {
                const queries = contracts.map(
                  ({ address, genesisBlock, abi, name }) => {
                    return {
                      range: [genesisBlock, latestBlockNumber] as BlockRange,
                      topics: depsToTopics(abi, model.deps[name]),
                      address
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

                return [
                  createQueryEvents({
                    id,
                    queries,
                    filters
                  }),
                  createAddEventsWatch({
                    id,
                    addresses: contracts.map(c => c.address),
                    fromBlock: latestBlockNumber
                  })
                ];
              })
            );
        })
      );
    })
  );
