import { Observable, NEVER, of, merge } from 'rxjs';
import {
  tap,
  finalize,
  mergeMapTo,
  distinctUntilChanged
} from 'rxjs/operators';

import * as fromEvents from '../modules/events';
import { Context } from '../context';
import { getInterceptor } from '../utils';

export const query = ({ genId, options, store }: Context) => (
  queryModel: fromEvents.QueryModel
): Observable<any> => {
  const id = genId();
  const model = {
    live: options.subscribeLogs,
    addresses: {},
    ...queryModel
  };
  return merge(
    NEVER,
    of(queryModel).pipe(
      getInterceptor('preQuery', options),
      tap(() =>
        store.dispatch(
          fromEvents.composeQueryFromModel({
            id,
            model
          })
        )
      ),
      mergeMapTo(store.select(fromEvents.getQueryResultFromQueryId(id))),
      distinctUntilChanged(
        (x, y) => x.status === y.status && x.events.length === y.events.length
      ),
      tap({
        next: x => {
          if (x && x.status === 'error') {
            throw Error('Could not fulfil request');
          }
        }
      })
    )
  ).pipe(
    getInterceptor('postQuery', options),
    finalize(() => {
      if (model.live) {
        store.dispatch(fromEvents.queryUnsubscribe(id));
      }
    })
  );
};
