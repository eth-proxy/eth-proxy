import { Observable } from 'rxjs';
import { mergeMap, exhaustMap, map, finalize } from 'rxjs/operators';
import { Provider, RawLog } from '../../interfaces';
import { send } from '../../utils';

interface Timed {
  timer$: Observable<any>;
}

export const pollChanges = <T extends string | RawLog>(
  provider: Provider,
  { timer$ }: Timed
) => (filter$: Observable<string>) => {
  const rpc = send(provider);
  return filter$.pipe(
    mergeMap(id => {
      const cleanup$ = rpc({
        method: 'eth_uninstallFilter',
        params: [id]
      });

      const getChanges$ = rpc({
        method: 'eth_getFilterChanges',
        params: [id]
      }).pipe(mergeMap(x => x as T[]));

      return timer$.pipe(
        exhaustMap(() => getChanges$),
        finalize(() => cleanup$.subscribe())
      );
    })
  );
};
