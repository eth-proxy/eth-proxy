import { QueryModel } from "../../model";
import { Observable } from "rxjs/Observable";
import {
  map,
  tap,
  ignoreElements,
  finalize,
  mergeMap,
  first,
  delayWhen,
  mergeMapTo
} from "rxjs/operators";
import { min, pick, values, flatten, mergeWith, pipe, concat, reduce } from "ramda";
import { never } from "rxjs/observable/never";

import { getContext } from "./context";
import { createQueries } from "./create-queries";
import {
  State,
  ObservableStore,
  createAddEventsWatch,
  createRemoveEventsWatch,
  createQueryEvents,
  getQueryResultsByAddress
} from "../../store";
import { merge } from "rxjs/observable/merge";
import { QueryState } from "../../store/reducers/events";
import { sortEvents } from "../../utils";
import { of } from "rxjs/observable/of";

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
            fromBlock: queries.map(x => x.range[1]).reduce(min, Infinity)
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
        
        const result$ = store.select(getQueryResultsByAddress).let(
          map(resultsByAddress => {
            const { events, failedQueries } = pipe(
              pick(addresses),
              values,
              reduce(mergeWith(concat), {})
            )(resultsByAddress) as any

            return {
              id,
              events: sortEvents(events),
              failedQueries
            }
          })
        );

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
