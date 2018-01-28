import { Observable } from 'rxjs/Observable';
import { tap, finalize, mergeMap, mergeMapTo } from 'rxjs/operators';
import { never } from 'rxjs/observable/never';
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';

import {
  State,
  ObservableStore,
  createRemoveEventsWatch,
  createComposeQueryFromModel,
  getQueryResultsFromModelId,
  QueryModel
} from '../../store';

export const query = (
  store: ObservableStore<State>,
  genId: () => string,
  interceptors
) => (queryModel: QueryModel): Observable<any> => {
  const id = genId();
  return merge(
    never(),
    of(queryModel).pipe(
      interceptors.preQuery,
      tap(() =>
        store.dispatch(createComposeQueryFromModel({ id, model: queryModel }))
      ),
      mergeMapTo(store.select(getQueryResultsFromModelId(id)))
    )
  ).pipe(
    interceptors.postQuery,
    finalize(() => store.dispatch(createRemoveEventsWatch(id)))
  );
};
