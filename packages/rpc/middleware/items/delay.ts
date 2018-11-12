import { SubscribableOrPromise, from } from 'rxjs';
import { mergeMapTo, first } from 'rxjs/operators';
import { Provider } from '../../interfaces';
import { Payload, Handler } from '../../providers';
import { MiddlewareItem } from '../model';

export function delayMiddleware(
  delayer$: SubscribableOrPromise<Provider>
): MiddlewareItem {
  return (payload: Payload, handle: Handler) => {
    return from(delayer$).pipe(
      first(),
      mergeMapTo(handle(payload))
    );
  };
}
