import { ActionsObservable, ofType } from 'redux-observable';
import { map, retry, catchError, mergeMap, filter } from 'rxjs/operators';
import { Observable, of, from, defer, EMPTY } from 'rxjs';

import { EpicContext } from '../../context';
import * as actions from './actions';
import { getBlockByNumber, getBlockByHash, watchBlocks } from '@eth-proxy/rpc';

export const loadLatestBlock = (
  _: ActionsObservable<any>,
  __,
  { provider }: EpicContext
): Observable<actions.Types> => {
  return defer(() => getBlockByNumber(provider, { number: 'latest' })).pipe(
    retry(10),
    map(actions.createLoadBlockSuccess),
    catchError(err => of(actions.createUpdateLatestBlockFailed(err)))
  );
};

export const loadBlock = (
  actions$: ActionsObservable<any>,
  __,
  { provider }: EpicContext
): Observable<actions.Types> => {
  return actions$.pipe(
    ofType<actions.LoadBlock>(actions.LOAD_BLOCK),
    mergeMap(({ payload: number }) => {
      return from(getBlockByNumber(provider, { number })).pipe(
        retry(10),
        map(actions.createLoadBlockSuccess),
        catchError(err => of(actions.createLoadBlockFailed(number, err)))
      );
    })
  );
};

export const watchNewBlocks = (
  _: ActionsObservable<any>,
  __,
  { provider, options }: EpicContext
): Observable<actions.Types> => {
  return of(options.watchBlocksTimer$).pipe(
    filter(x => !!x),
    mergeMap(timer$ => {
      return watchBlocks(provider, { timer$ }).pipe(
        mergeMap(hash => {
          return from(getBlockByHash(provider, { hash })).pipe(
            retry(10),
            catchError(() => EMPTY)
          );
        })
      );
    }),
    map(actions.createLoadBlockSuccess)
  );
};
