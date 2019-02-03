import { Provider } from '../interfaces';
import { SubscribableOrPromise, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export function delayedProvider(
  provider: SubscribableOrPromise<Provider>
): Provider {
  const provider$ = from(provider);

  return {
    send: payload => {
      return provider$.toPromise().then(p => p.send(payload));
    },
    observe: subId => {
      return provider$.pipe(mergeMap(p => p.observe(subId)));
    },
    disconnect: () => {
      return provider$.toPromise().then(p => p.disconnect());
    }
  };
}
