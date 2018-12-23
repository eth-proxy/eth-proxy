import { Provider, SubscribeArgs } from '../interfaces';
import { mergeMap } from 'rxjs/operators';
import { subscribe } from '../methods';
import { Observable, defer } from 'rxjs';

export function createSubscription<T>(
  provider: Provider,
  args: SubscribeArgs
): Observable<T> {
  return defer(() => subscribe(provider, args)).pipe(
    mergeMap(subId => {
      return provider.observe(subId);
      // COMMENTED DUE TO UNSUBSCRIBE ISSUE
      // .pipe(finalize(() => unsubscribe(provider, subId)));
    })
  );
}
