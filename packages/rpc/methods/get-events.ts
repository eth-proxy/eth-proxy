import { curry, map } from 'ramda';
import { Provider, FilterObject } from '../interfaces';
import { send } from '../utils';
import { formatFilter, fromLog } from '../formatters';

export const getEvents = curry((provider: Provider, options: FilterObject) => {
  return send(provider)({
    method: 'eth_getLogs',
    params: [formatFilter(options)]
  }).then(map(fromLog));
});
