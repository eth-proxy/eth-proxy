import { Provider, SendAsync } from '../interfaces';
import { SubscribableOrPromise, from } from 'rxjs';

export function delayedProvider(provider$: SubscribableOrPromise<Provider>) {
  return {
    provider$: from(provider$),
    sendAsync: ((payload, cb) => {
      return from(provider$).subscribe(provider =>
        provider.sendAsync(payload, cb)
      );
    }) as SendAsync
  };
}
