import { curry } from 'ramda';
import { PubSubProvider, RawFilter } from '../interfaces';
import { fromLog } from '../formatters';
import { map } from 'rxjs/operators';
import { createSubscription } from './create';

type NewHeadsOptions = Pick<RawFilter, 'address' | 'topics'>;

export const subscribeLogs = curry(
  (provider: PubSubProvider, opts: NewHeadsOptions) => {
    return createSubscription(provider, ['logs', opts]).pipe(map(fromLog));
  }
);
