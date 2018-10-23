import { ActionsObservable, ofType } from 'redux-observable';
import { map, retry, catchError, mergeMap, filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  getBlockByNumber,
  watchBlocks,
  getBlockByHash
} from '@eth-proxy/rx-web3';

import { EpicContext } from '../../context';
import * as actions from './actions';

export const loadLatestBlock = (
  _: ActionsObservable<any>,
  __,
  { rpc }: EpicContext
): Observable<actions.Types> => {
  return rpc(getBlockByNumber({ number: 'latest' })).pipe(
    retry(10),
    map(actions.createLoadBlockSuccess),
    catchError(err => of(actions.createUpdateLatestBlockFailed(err)))
  );
};

export const loadBlock = (
  actions$: ActionsObservable<any>,
  __,
  { rpc }: EpicContext
): Observable<actions.Types> => {
  return actions$.pipe(
    ofType<actions.LoadBlock>(actions.LOAD_BLOCK),
    mergeMap(({ payload: number }) => {
      return rpc(getBlockByNumber({ number })).pipe(
        map(actions.createLoadBlockSuccess),
        catchError(err => of(actions.createLoadBlockFailed(number, err)))
      );
    })
  );
};

export const watchNewBlocks = (
  _: ActionsObservable<any>,
  __,
  { rpc, options }: EpicContext
): Observable<actions.Types> => {
  return of(options.watchBlocksTimer$).pipe(
    filter(x => !!x),
    mergeMap(timer$ => {
      return rpc(watchBlocks({ timer$ })).pipe(
        mergeMap(hash => rpc(getBlockByHash({ hash })))
      );
    }),
    map(actions.createLoadBlockSuccess)
  );
};
