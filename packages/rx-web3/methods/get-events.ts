import { curry, map } from 'ramda';
import { forkJoin } from 'rxjs';
import { flatten } from 'ramda';
import { Provider, FilterObject, Log } from '../interfaces';
import { send, arrify } from '../utils';
import { formatFilter, fromLog } from '../formatters';
import { map as rxMap } from 'rxjs/operators';

// TESTRPC WATCH DOES NOT WORK WITH ADDRESS LIST
export const getEvents = curry((provider: Provider, options: FilterObject) => {
  const eventLoaders$ = arrify(options.address).map(address => {
    return getLogs(provider)(
      Object.assign({}, options, {
        address
      })
    );
  });

  return forkJoin(eventLoaders$).pipe(rxMap(x => flatten<Log>(x)));
});

export const getLogs = curry((provider: Provider, options: FilterObject) => {
  return send(provider)({
    method: 'eth_getLogs',
    params: [formatFilter(options)]
  }).pipe(
    rxMap(x => x.result),
    rxMap(map(fromLog))
  );
});
