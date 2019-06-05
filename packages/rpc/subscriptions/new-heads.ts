import { curry, isEmpty } from 'ramda';
import { NewHeadsOptions, Provider, RawBlock } from '../interfaces';
import { fromBlock } from '../converters';
import { map } from 'rxjs/operators';
import { createSubscription } from './create';

export const subscribeNewHeads = curry(
  (provider: Provider, args: NewHeadsOptions) => {
    const parametrized = !isEmpty(args);

    return createSubscription<RawBlock>(provider, {
      type: 'newHeads',
      ...(parametrized && { args })
    }).pipe(map(fromBlock));
  }
);

subscribeNewHeads(undefined as any, {});
