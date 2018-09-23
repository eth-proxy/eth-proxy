import { ActionsObservable, ofType } from 'redux-observable';
import { map, retry, catchError, mergeMap, filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { EpicContext } from '../../context';
import * as actions from './actions';

export const loadLatestBlock = (
  _: ActionsObservable<any>,
  __,
  { getBlock }: EpicContext
): Observable<actions.Types> => {
  return getBlock('latest').pipe(
    retry(10),
    map(actions.createLoadBlockSuccess),
    catchError(err => of(actions.createUpdateLatestBlockFailed(err)))
  );
};

export const loadBlock = (
  actions$: ActionsObservable<any>,
  __,
  { getBlock }: EpicContext
): Observable<actions.Types> => {
  return actions$.pipe(
    ofType<actions.LoadBlock>(actions.LOAD_BLOCK),
    mergeMap(({ payload: number }) => {
      return getBlock(number).pipe(
        map(actions.createLoadBlockSuccess),
        catchError(err => of(actions.createLoadBlockFailed(number, err)))
      );
    })
  );
};

export const watchNewBlocks = (
  _: ActionsObservable<any>,
  __,
  { watchLatestBlock, options }: EpicContext
): Observable<actions.Types> => {
  return of(options.watchBlocks).pipe(
    filter(x => !!x),
    mergeMap(watchLatestBlock),
    map(actions.createLoadBlockSuccess)
  );
};
