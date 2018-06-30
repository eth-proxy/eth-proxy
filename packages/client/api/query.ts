import { Observable, NEVER, of, merge } from 'rxjs';
import { tap, finalize, mergeMapTo } from 'rxjs/operators';

import { getQueryResultFromQueryId } from '../modules/events';
import * as fromEvents from '../modules/events';
import { Context } from '../context';
import { getInterceptor } from '../utils';

export const query = ({ genId, options, store }: Context) => (
  queryModel: fromEvents.QueryModel
): Observable<any> => {
  const id = genId();
  return merge(
    NEVER,
    of(queryModel).pipe(
      getInterceptor('preQuery', options),
      tap(() =>
        store.dispatch(
          fromEvents.createComposeQueryFromModel({ id, model: queryModel })
        )
      ),
      mergeMapTo(store.select(getQueryResultFromQueryId(id))),
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
    finalize(() => store.dispatch(fromEvents.createRemoveEventsWatch(id)))
  );
};
