import { Observable } from 'rxjs';
import { Provider, SendAsync } from '../interfaces';

export function delayedProvider(provider$: Observable<Provider>) {
  return {
    provider$,
    sendAsync: ((payload, cb) => {
      return provider$.subscribe(provider => provider.sendAsync(payload, cb));
    }) as SendAsync
  };
}
