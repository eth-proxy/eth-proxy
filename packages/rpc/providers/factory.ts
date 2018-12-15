import { SubHandler } from './model';
import { mergeAll } from 'ramda';
import { Provider } from '../interfaces';

export function enhanceProvider(
  subHandlers: SubHandler[],
  provider: Provider
): Provider {
  const all = mergeAll<SubHandler>(subHandlers);

  return {
    ...provider,
    send: payload => {
      if (Array.isArray(payload)) {
        throw Error('Batch not suppoted');
      }
      const maybeHandler = all[payload.method];
      if (maybeHandler) {
        return maybeHandler(payload).toPromise();
      }

      return provider.send(payload);
    }
  };
}
