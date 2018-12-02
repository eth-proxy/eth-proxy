import { Observable, timer, merge, of, concat } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { curry } from 'ramda';
import { Provider, FilterObject, RawLog, Log } from '../interfaces';
import { arrify, send$ } from '../utils';
import { pollChanges } from './common';
import { formatFilter, fromLog } from '../formatters';

export interface WatchLogsOptions {
  timer$?: Observable<any>;
  filter: FilterObject;
}
// TESTRPC & METAMASK WATCH DOES NOT WORK WITH ADDRESS LIST
export const watchLogs = curry(
  (provider: Provider, options: WatchLogsOptions) => {
    const eventLoaders$ = arrify(options.filter.address || [null]).map(
      address => {
        return watchEvents(provider)({
          ...options,
          filter: {
            ...options.filter,
            address
          }
        });
      }
    );

    return merge(...eventLoaders$);
  }
);

export const watchEvents = curry(
  (
    provider: Provider,
    { filter, timer$ = timer(0, 1000) }: WatchLogsOptions
  ) => {
    const createFilter$ = send$(provider)({
      method: 'eth_newFilter',
      params: [formatFilter(filter)]
    });

    return createFilter$.pipe(
      mergeMap(id => {
        const pastLogs$ = send$(provider)({
          method: 'eth_getFilterLogs',
          params: [id]
        }).pipe(mergeMap(x => x));

        const poll$ = of(id).pipe(pollChanges<RawLog>(provider, { timer$ }));

        return concat(pastLogs$, poll$);
      }),
      map(fromLog)
    ) as Observable<Log>;
  }
);
