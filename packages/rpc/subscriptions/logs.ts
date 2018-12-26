import { curry } from 'ramda';
import { Provider, LogFilter, RawLog } from '../interfaces';
import { fromLog } from '../converters';
import { map } from 'rxjs/operators';
import { createSubscription } from './create';

export const subscribeLogs = curry((provider: Provider, opts: LogFilter) => {
  return createSubscription<RawLog>(provider, {
    type: 'logs',
    args: opts
  }).pipe(map(fromLog));
});
