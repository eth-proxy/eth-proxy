import * as Web3 from 'web3';
import { createWeb3 } from '../utils';
import { bindNodeCallback, Observable } from 'rxjs';
import { getBlock } from './get-block';
import { concat, switchMap, distinctUntilKeyChanged } from 'rxjs/operators';

const watchLatestBlockHash = (provider: Web3.Provider): Observable<string> => {
  const web3 = createWeb3(provider);
  const filter = web3.eth.filter('latest');

  return Observable.create(observer => {
    filter.watch((err, blockHash) => {
      if (err) {
        observer.error(err);
      } else {
        observer.next(blockHash);
      }
    });
    return () => filter.stopWatching(_ => {});
  });
};

export function watchLatestBlock(
  provider: Web3.Provider
): Observable<Web3.Block> {
  // getBlock is faster then filter
  return getBlock(provider, 'latest').pipe(
    concat(
      watchLatestBlockHash(provider).pipe(
        switchMap(hash => getBlock(provider, hash))
      )
    ),
    distinctUntilKeyChanged('hash')
  );
}
