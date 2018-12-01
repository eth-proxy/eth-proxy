import { curry } from 'ramda';
import { PubSubProvider } from '../interfaces';
import { fromBlock } from '../formatters';
import { map } from 'rxjs/operators';
import { createSubscription } from './create';

interface NewHeadsOptions {
  includeTransactions?: boolean;
}

export const subscribeNewHeads = curry(
  (provider: PubSubProvider, opts: NewHeadsOptions) => {
    return createSubscription(provider, ['newHeads', opts]).pipe(
      map(fromBlock)
    );
  }
);
