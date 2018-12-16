import { curry } from 'ramda';
import { Provider, LogFilter } from '../interfaces';
import { fromLog } from '../formatters';
import { map } from 'rxjs/operators';
import { createSubscription } from './create';

export const subscribeLogs = curry((provider: Provider, opts: LogFilter) => {
  return createSubscription(provider, {
    type: 'logs',
    args: opts
  }).pipe(map(fromLog));
});
