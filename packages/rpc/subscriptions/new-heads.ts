import { curry } from 'ramda';
import { NewHeadsOptions, Provider, RawBlock } from '../interfaces';
import { fromBlock } from '../converters';
import { map } from 'rxjs/operators';
import { createSubscription } from './create';

export const subscribeNewHeads = curry(
  (provider: Provider, args: NewHeadsOptions) => {
    return createSubscription<RawBlock>(provider, {
      type: 'newHeads',
      args
    }).pipe(map(fromBlock));
  }
);
