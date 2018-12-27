import { curry, map, flatten } from 'ramda';
import { Provider, FilterObject, Log } from '../interfaces';
import { send, arrify } from '../utils';
import { toFilter, fromLog } from '../converters';

// METAMASK WATCH DOES NOT WORK WITH ADDRESS LIST
export const getEvents = curry((provider: Provider, options: FilterObject) => {
  const eventLoaders$ = arrify(options.address || [null]).map(address => {
    return getLogs(provider)(
      Object.assign({}, options, {
        address
      })
    );
  });

  return Promise.all(eventLoaders$).then(x => flatten<Log>(x));
});

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getlogs
 */
export const getLogs = curry((provider: Provider, options: FilterObject) => {
  return send(provider)({
    method: 'eth_getLogs',
    params: [toFilter(options)]
  }).then(map(fromLog));
});
