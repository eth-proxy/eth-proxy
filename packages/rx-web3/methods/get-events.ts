import { curry, map } from 'ramda';
import { forkJoin } from 'rxjs';
import { flatten } from 'ramda';
import { Provider, FilterObject, Log } from '../interfaces';
import { send, arrify } from '../utils';
import { formatFilter, fromLog } from '../formatters';
import { map as rxMap } from 'rxjs/operators';

// TESTRPC & METAMASK WATCH DOES NOT WORK WITH ADDRESS LIST
export const getEvents = curry((options: FilterObject, provider: Provider) => {
  const eventLoaders$ = arrify(options.address).map(address => {
    return getLogs(
      Object.assign({}, options, {
        address
      }),
      provider
    );
  });

  return forkJoin(eventLoaders$).pipe(rxMap(x => flatten<Log>(x)));
});

export const getLogs = curry((options: FilterObject, provider: Provider) => {
  return send(provider)({
    method: 'eth_getLogs',
    params: [formatFilter(options)]
  }).pipe(rxMap(map(fromLog)));
});
