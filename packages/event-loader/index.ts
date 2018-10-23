import { createBlockchainReader } from './blockchain-loader';
import { EventFilter } from './model';
import { bufferResult } from './results-buffer';
import { pipe, curry } from 'ramda';
import { Observable, of } from 'rxjs';
import { Provider } from '@eth-proxy/rx-web3';

export const defaultReader = curry(
  (filter: EventFilter, provider: Provider) => {
    const bcReader = createBlockchainReader(provider);

    return pipe(
      bcReader,
      bufferResult
    )(filter, of([filter.fromBlock, filter.toBlock] as [number, number]));
  }
);

export * from './blockchain-loader';
export * from './model';
