import { createBlockchainReader } from './blockchain-loader';
import { EventFilter } from './model';
import { bufferResult } from './results-buffer';
import { pipe } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Provider } from '@eth-proxy/rx-web3';

export function defaultReader(provider: Provider, filter: EventFilter) {
  const bcReader = createBlockchainReader(provider);

  return pipe(bcReader, bufferResult)(
    filter,
    of([filter.fromBlock, filter.toBlock] as [number, number])
  );
}

export * from './blockchain-loader';
export * from './model';
