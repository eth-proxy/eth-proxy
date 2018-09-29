import { createWeb3 } from '../utils';
import { Observable, EMPTY } from 'rxjs';
import { getBlockByHash } from './get-block';
import { switchMap, distinctUntilKeyChanged, catchError } from 'rxjs/operators';
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
  const blockLoader = getBlockByHash(provider);

  return watchLatestBlockHash(provider).pipe(
    switchMap(hash => blockLoader({ hash }).pipe(catchError(() => EMPTY))),
    distinctUntilKeyChanged('hash')
  );
}
