import { ActionsObservable, StateObservable } from 'redux-observable';
import { mergeMap, map } from 'rxjs/operators';
import { forkJoin, Observable, defer } from 'rxjs';
import { keys, isNil, chain } from 'ramda';

import * as actions from '../actions';
import { EpicContext } from 'client/context';
import { BlockRange } from '../model';
import { depsToTopics } from '../utils/expand-model';
import { splitQueryByTopics, toTopicList } from '../utils';
import { State } from 'client/store';
import { ofType } from 'client/utils';
import { arrify, blockNumber } from '@eth-proxy/rpc';

export const composeQueries = (
  actions$: ActionsObservable<actions.ComposeQueryFromModel>,
  _: StateObservable<State>,
  { contractLoader, provider }: EpicContext
): Observable<actions.Types> =>
  actions$.pipe(
    ofType(actions.COMPOSE_QUERY_FROM_MODEL),
    mergeMap(({ payload: { id, model } }) => {
      return forkJoin(keys(model.deps).map(contractLoader)).pipe(
        mergeMap(contracts => {
          return defer(() => blockNumber(provider)).pipe(
            map(latestBlockNumber => {
              const queries = contracts.map(
                ({ address, genesisBlock, abi, name }) => {
                  const rangeStart = Math.max(
                    model.fromBlock || 0,
                    genesisBlock || 0
                  );
                  const queryAddress = (model.addresses || {})[name] || address;
                  if (isNil(queryAddress)) {
                    throw Error('Query address not found');
                  }

                  return {
                    range: [rangeStart, latestBlockNumber] as BlockRange,
                    topics: depsToTopics(abi, (model.deps as any)[name]),
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

              return actions.queryEvents({
                id,
                queries,
                filters,
                live: model.live!
              });
            })
          );
        })
      );
    })
  );
