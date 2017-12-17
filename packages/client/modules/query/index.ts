import { QueryModel } from '../../model';
import { Observable } from 'rxjs/Observable';
import {
  map,
  tap,
  finalize,
  mergeMap,
  first,
  delayWhen,
  mergeMapTo
} from 'rxjs/operators';
import { pick, values, flatten, assoc } from 'ramda';
import { never } from 'rxjs/observable/never';

import { getContext } from './context';
import { createQueries } from './create-queries';
import {
  State,
  ObservableStore,
  createAddEventsWatch,
  createRemoveEventsWatch,
  createQueryEvents,
  getQueryResultFromAddresses
} from '../../store';
import { merge } from 'rxjs/observable/merge';
import { QueryState } from '../../store/reducers/events';
import { of } from 'rxjs/observable/of';

let globalId = 0;

export const query = (store: ObservableStore<State>, interceptors) => (
  queryModel: QueryModel
): Observable<any> => {
  const id = globalId++;
  return merge(
    never(),
    of(queryModel).pipe(
      interceptors.preQuery,
      mergeMap(getContext(store)),
      tap(context => {
        const queries = createQueries(context);
        store.dispatch(createQueryEvents(queries));
        store.dispatch(
          createAddEventsWatch({
            id,
            addresses: queries.map(x => x.address),
            fromBlock: context.latestBlockNumber
          })
        );
      }),
      mergeMap(context => {
        const addresses = context.contracts.map(x => x.address);
        const queries$ = store.select(x => {
          const queried = pick(addresses, x.events.queries);
          const queriedArray = values(queried);
          return flatten<QueryState>(queriedArray);
        });
        const loaded$ = queries$.pipe(first(qs => !qs.some(q => q.loading)));

        const result$ = store
          .select(getQueryResultFromAddresses(addresses))
          .pipe(map(assoc('id', id)));

        return queries$.pipe(
          delayWhen(() => loaded$),
          first(),
          mergeMapTo(result$)
        );
      })
    )
  ).pipe(
    interceptors.postQuery,
    finalize(() => store.dispatch(createRemoveEventsWatch(id)))
  );
};
