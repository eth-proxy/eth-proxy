import { Provider } from '../interfaces';
import { SubscribableOrPromise, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export function delayedProvider(
  lateProvider: SubscribableOrPromise<Provider>
): Provider {
  const provider$ = from(lateProvider);

  return {
    send: payload => {
      return provider$.toPromise().then(provider => provider.send(payload));
    },
    observe: subId => {
      return provider$.pipe(mergeMap(provider => provider.observe(subId)));
    },
    disconnect: () => {
      return provider$.toPromise().then(provider => provider.disconnect());
    }
  };
}
