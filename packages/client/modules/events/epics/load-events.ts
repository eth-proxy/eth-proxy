import { forkJoin, of, Observable } from 'rxjs';
import { map as rxMap, catchError, mergeMap, map } from 'rxjs/operators';
import { flatten, filter, pathEq, min, max } from 'ramda';
import { ActionsObservable } from 'redux-observable';
import * as actions from '../actions';
import { BlockRange, QueryResult, QueryArgs } from '../model';
import { EpicContext } from '../../../context';
import * as fromSchema from '../../schema';

export const queryEvents = (
  action$: ActionsObservable<actions.QueryEvents>,
  store,
  { getEvents }: EpicContext
) => {
  // Could buffer requests by time lets say 10ms
  return action$.ofType(actions.QUERY_EVENTS).pipe(
    mergeMap(({ payload }) => {
      const addresses = payload.map(q => q.address);
      const genesis = payload.map(x => x.range[0]).reduce(min, Infinity);
      const toBlock = payload.map(x => x.range[1]).reduce(max, 0);
      const decodeLogs = fromSchema.getLogDecoder(store.getState());

      return forkJoin(
        payload.map(({ range: [fromBlock, toBlock], address }) => {
          return getEvents({
            toBlock,
            fromBlock,
            address
          });
        })
      ).pipe(
        rxMap(flatten),
        rxMap(decodeLogs),
        rxMap(events => ({
          range: [genesis, toBlock] as BlockRange,
          events
        })),
        map(({ range, events }) => {
          const results = addresses.map(address => ({
            address,
            events: filter(pathEq(['meta', 'address'], address), events),
            range
          }));
          return actions.createQueryEventsSuccess(results);
        }),
        catchError(err => {
          console.error(err);
          return of(actions.createQueryEventsFailed(payload));
        })
      );
    })
  );
};
