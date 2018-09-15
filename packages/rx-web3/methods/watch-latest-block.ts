import { createWeb3 } from '../utils';
import { bindNodeCallback, Observable } from 'rxjs';
import { getBlock } from './get-block';
import { concat, switchMap, distinctUntilKeyChanged } from 'rxjs/operators';
import { Provider, Block } from '../interfaces';

const watchLatestBlockHash = (provider: Provider): Observable<string> => {
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

export function watchLatestBlock(provider: Provider): Observable<Block> {
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
