import { ActionsObservable } from 'redux-observable';
import { EpicContext } from '../model';
import * as actions from '../actions';
import { map, retry, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export const watchLatestBlock = (
  _: ActionsObservable<any>,
  __,
  { watchLatestBlock }: EpicContext
) => {
  return watchLatestBlock().pipe(
    retry(10),
    map(actions.createUpdateLatestBlock),
    catchError(err => of(actions.createUpdateLatestBlockFailed(err)))
  );
};
