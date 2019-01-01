import { curry, flatten, map } from 'ramda';
import { Provider, FilterObject, Log, EthGetLogs } from '../interfaces';
import { arrify, createRequest, createMethod } from '../utils';
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

export const toRequest = (options: FilterObject): EthGetLogs['request'] => {
  return {
    method: 'eth_getLogs',
    params: [toFilter(options)]
  };
};

const fromResult = map(fromLog);

const getLogsDef = {
  request: toRequest,
  result: fromResult
};

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getlogs
 */
export const getLogsReq = createRequest(getLogsDef);

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getlogs
 */
export const getLogs = createMethod(getLogsDef);
