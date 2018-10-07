import { Observable, timer, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { curry } from 'ramda';
import { Provider, FilterObject, RawLog, Log } from '../../interfaces';
import { send, arrify } from '../../utils';
import { pollChanges } from './common';
import { formatFilter, fromLog } from '../../formatters';

export interface WatchLogsOptions {
  timer$?: Observable<any>;
  filter: FilterObject;
}
// TESTRPC & METAMASK WATCH DOES NOT WORK WITH ADDRESS LIST
export const watchLogs = curry(
  (provider: Provider, options: WatchLogsOptions) => {
    const eventLoaders$ = arrify(options.filter.address).map(address => {
      return _watchLogs(provider)({
        ...options,
        filter: {
          ...options.filter,
          address
        }
      });
    });

    return merge(...eventLoaders$);
  }
);

export const _watchLogs = curry(
  (
    provider: Provider,
    { filter, timer$ = timer(0, 1000) }: WatchLogsOptions
  ) => {
    const createFilter$ = send(provider)({
      method: 'eth_newFilter',
      params: [formatFilter(filter)]
    });

    return createFilter$.pipe(
      pollChanges<RawLog>(provider, { timer$ }),
      map(fromLog)
    ) as Observable<Log>;
  }
);
