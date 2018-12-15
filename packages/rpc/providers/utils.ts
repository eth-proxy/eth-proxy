import { Provider } from '../interfaces';
import { Handler, Payload } from '../providers';
import { from, EMPTY } from 'rxjs';

export function asHandler(provider: Provider): Handler {
  return (payload: Payload) => from(provider.send(payload));
}

export function asProvider(hadler: Handler): Provider {
  return {
    send: (payload: any) => {
      return hadler(payload).toPromise();
    },
    disconnect: () => {},
    observe: () => EMPTY
  };
}
