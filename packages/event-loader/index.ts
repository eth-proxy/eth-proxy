import { createBlockchainReader } from './blockchain-loader';
import { EventFilter } from './model';
import { bufferResult } from './results-buffer';
import { pipe } from 'ramda';
import { of } from 'rxjs';
import { Provider } from '@eth-proxy/rpc';

export function defaultReader(provider: Provider, filter: EventFilter) {
  const bcReader = createBlockchainReader(provider);

  return pipe(
    bcReader,
    bufferResult
  )(
    filter,
    of([filter.fromBlock, filter.toBlock] as [number, number])
  ).toPromise();
}

export * from './blockchain-loader';
export * from './model';
