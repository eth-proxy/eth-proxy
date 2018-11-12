import { Provider } from '../interfaces';
import { Handler, Payload } from '../providers';
import { Observable } from 'rxjs';

export function asHandler(provider: Provider): Handler {
  return (payload: Payload) =>
    new Observable(obs => {
      provider.sendAsync(payload, (err, res) => {
        if (err) {
          return obs.error(err);
        }
        obs.next(res);
        obs.complete();
      });
    });
}

export function asProvider(hadler: Handler): Provider {
  return {
    sendAsync: (payload: any, cb: any) =>
      hadler(payload).subscribe({
        next: response => cb(null, response),
        error: cb
      })
  };
}
