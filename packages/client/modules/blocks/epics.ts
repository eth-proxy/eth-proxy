import { ActionsObservable, ofType } from 'redux-observable';
import { map, retry, catchError, mergeMap, filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { EpicContext } from '../../context';
import * as actions from './actions';

export const loadLatestBlock = (
  _: ActionsObservable<any>,
  __,
  { getBlockByNumber }: EpicContext
): Observable<actions.Types> => {
  return getBlockByNumber({ number: 'latest' }).pipe(
    retry(10),
    map(actions.createLoadBlockSuccess),
    catchError(err => of(actions.createUpdateLatestBlockFailed(err)))
  );
};

export const loadBlock = (
  actions$: ActionsObservable<any>,
  __,
  { getBlockByNumber }: EpicContext
): Observable<actions.Types> => {
  return actions$.pipe(
    ofType<actions.LoadBlock>(actions.LOAD_BLOCK),
    mergeMap(({ payload: number }) => {
      return getBlockByNumber({ number }).pipe(
        map(actions.createLoadBlockSuccess),
        catchError(err => of(actions.createLoadBlockFailed(number, err)))
      );
    })
  );
};

export const watchNewBlocks = (
  _: ActionsObservable<any>,
  __,
  { watchBlocks, getBlockByHash, options }: EpicContext
): Observable<actions.Types> => {
  return of(options.watchBlocksTimer$).pipe(
    filter(x => !!x),
    mergeMap(timer$ => {
      return watchBlocks({ timer$ }).pipe(
        mergeMap(hash => getBlockByHash({ hash }))
      );
    }),
    map(actions.createLoadBlockSuccess)
  );
};
