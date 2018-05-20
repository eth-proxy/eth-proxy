import { Observable } from 'rxjs/Observable';
import { tap, finalize, mergeMapTo } from 'rxjs/operators';
import { never } from 'rxjs/observable/never';
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';

import {
  State,
  ObservableStore,
  getQueryResultsFromModelId
} from '../../store';
import { QueryModel } from './model';
import * as actions from './actions';

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
        store.dispatch(
          actions.createComposeQueryFromModel({ id, model: queryModel })
        )
      ),
      mergeMapTo(store.select(getQueryResultsFromModelId(id)))
    )
  ).pipe(
    interceptors.postQuery,
    finalize(() => store.dispatch(actions.createRemoveEventsWatch(id)))
  );
};
