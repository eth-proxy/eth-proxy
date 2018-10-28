import { Observable, timer } from 'rxjs';
import { curry } from 'ramda';
import { Provider } from '../interfaces';
import { send$ } from '../utils';
import { pollChanges } from './common';

export interface BlockWatchOptions {
  timer$?: Observable<any>;
}

export const watchBlocks = curry(
  (provider: Provider, { timer$ = timer(0, 1000) }: BlockWatchOptions) => {
    const createFilter$ = send$(provider)({
      method: 'eth_newBlockFilter',
      params: []
    });

    return createFilter$.pipe(pollChanges<string>(provider, { timer$ }));
  }
);
