import { Provider, SubscribeArgs } from '../interfaces';
import { mergeMap, tap } from 'rxjs/operators';
import { subscribe, unsubscribe } from '../methods';
import { Observable, defer } from 'rxjs';

export function createSubscription<T>(
  provider: Provider,
  args: SubscribeArgs
): Observable<T> {
  return new Observable<T>(obs => {
    let activeSubId: string | null = null;

    const sub = defer(() => subscribe(provider, args))
      .pipe(
        tap(id => {
          activeSubId = id;
        }),
        mergeMap(id => {
          return provider.observe(id).pipe(
            tap({
              error: () => {
                activeSubId = null;
              }
            })
          );
        })
      )
      .subscribe(obs);

    return () => {
      if (activeSubId) {
        unsubscribe(provider, activeSubId);
      }
      sub.unsubscribe();
    };
  });
}
