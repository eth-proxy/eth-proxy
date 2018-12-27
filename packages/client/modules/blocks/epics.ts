import { ActionsObservable, StateObservable } from 'redux-observable';
import {
  map,
  retry,
  catchError,
  mergeMap,
  retryWhen,
  delay
} from 'rxjs/operators';
import { Observable, of, from, defer, EMPTY } from 'rxjs';

import { EpicContext } from '../../context';
import * as actions from './actions';
import { getBlockByNumber, subscribeNewHeads } from '@eth-proxy/rpc';
import { ofType } from '../../utils';

export const loadLatestBlock = (
  _: ActionsObservable<any>,
  __: StateObservable<any>,
  { provider }: EpicContext
): Observable<actions.Types> => {
  return defer(() => getBlockByNumber(provider, { number: 'latest' })).pipe(
    retry(10),
    map(actions.createLoadBlockSuccess),
    catchError(err => of(actions.createUpdateLatestBlockFailed(err)))
  );
};

export const loadBlock = (
  actions$: ActionsObservable<actions.Types>,
  __: StateObservable<any>,
  { provider }: EpicContext
): Observable<actions.Types> => {
  return actions$.pipe(
    ofType(actions.LOAD_BLOCK),
    mergeMap(({ payload: number }) => {
      return from(getBlockByNumber(provider, { number })).pipe(
        map(actions.createLoadBlockSuccess),
        catchError(err => of(actions.createLoadBlockFailed(number, err)))
      );
    })
  );
};

export const watchNewBlocks = (
  _: ActionsObservable<any>,
  __: StateObservable<any>,
  { provider, options }: EpicContext
): Observable<actions.Types> => {
  return options.trackBlocks
    ? subscribeNewHeads(provider, {}).pipe(
        retryWhen(delay(5000)),
        map(actions.createLoadBlockSuccess)
      )
    : EMPTY;
};
