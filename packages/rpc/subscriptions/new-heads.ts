import { curry } from 'ramda';
import { NewHeadsOptions, Provider } from '../interfaces';
import { fromBlock } from '../formatters';
import { map } from 'rxjs/operators';
import { createSubscription } from './create';

export const subscribeNewHeads = curry(
  (provider: Provider, args: NewHeadsOptions) => {
    return createSubscription(provider, {
      type: 'newHeads',
      args
    }).pipe(map(fromBlock));
  }
);
