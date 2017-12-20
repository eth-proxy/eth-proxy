import { ActionsObservable } from 'redux-observable';
import { EpicContext } from '../model';
import { getLatestBlock, getBlock } from '@eth-proxy/rx-web3';
import {
  createUpdateLatestBlock,
  UpdateLatestBlock,
  createUpdateLatestBlockFailed,
  UpdateLatestBlockFailed
} from '../actions/blocks';
import {
  map,
  mergeMap,
  retryWhen,
  delay,
  take,
  concat,
  retry,
  catchError
} from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export const watchLatestBlock = (
  _: ActionsObservable<any>,
  store,
  { web3Proxy$, options }: EpicContext
) => {
  return web3Proxy$.pipe(
    mergeMap(web3 =>
      getBlock('latest')(web3).pipe(
        retry(10),
        map(createUpdateLatestBlock),
        catchError(err => of(createUpdateLatestBlockFailed(err)))
      )
    )
  );
};
