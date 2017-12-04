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
import { min, pick, values, flatten, chain } from "ramda";
import { never } from "rxjs/observable/never";

import { getContext } from "./context";
import { createQueries } from "./create-queries";
import {
  State,
  ObservableStore,
  createAddEventsWatch,
  createRemoveEventsWatch,
  createQueryEvents,
  getEventsForAddresses
} from "../../store";
import { merge } from "rxjs/observable/merge";
import { QueryState } from "../../store/reducers/events";
import { sortEvents } from "../../utils";

let globalId = 0;
// should return events
export const query = (store: ObservableStore<State>) => (
  queryModel: QueryModel
): Observable<any> => {
  const id = globalId++;
  return merge(
    never(),
    getContext(store, queryModel).pipe(
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
        const loaded$ = queries$.pipe(first(qs => qs.every(q => !q.loading)));

        return queries$.pipe(
          delayWhen(() => loaded$),
          first(),
          mergeMapTo(
            store.select(getEventsForAddresses(addresses)).let(map(sortEvents))
          )
        );
      })
    )
  ).pipe(finalize(() => store.dispatch(createRemoveEventsWatch(id))));
};
