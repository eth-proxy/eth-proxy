import { Observable } from 'rxjs/Observable';
import { tap, finalize, mergeMapTo } from 'rxjs/operators';
import { never } from 'rxjs/observable/never';
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';

import { getQueryResultFromQueryId } from '../modules/events';
import * as fromEvents from '../modules/events';
import { Context } from '../context';
import { getInterceptor } from '../utils';

export const query = ({ genId, options, store }: Context) => (
  queryModel: fromEvents.QueryModel
): Observable<any> => {
  const id = genId();
  return merge(
    never(),
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
            throw new Error('Could not fulfil request');
          }
        }
      })
    )
  ).pipe(
    getInterceptor('postQuery', options),
    finalize(() => store.dispatch(fromEvents.createRemoveEventsWatch(id)))
  );
};
