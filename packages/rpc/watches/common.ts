import { Observable } from 'rxjs';
import { mergeMap, exhaustMap, finalize } from 'rxjs/operators';
import { Provider, RawLog } from '../interfaces';
import { send, send$ } from '../utils';

interface Timed {
  timer$: Observable<any>;
}

export const pollChanges = <T extends string | RawLog>(
  provider: Provider,
  { timer$ }: Timed
) => (filter$: Observable<string>) => {
  return filter$.pipe(
    mergeMap(id => {
      const cleanup = () =>
        send(provider)({
          method: 'eth_uninstallFilter',
          params: [id]
        });

      const getChanges = () => {
        return send$(provider)({
          method: 'eth_getFilterChanges',
          params: [id]
        }).pipe(mergeMap(x => x as T[]));
      };

      return timer$.pipe(
        exhaustMap(getChanges),
        finalize(cleanup)
      );
    })
  );
};
