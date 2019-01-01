import { Provider, Subprovider, RpcRequest, RpcResponses } from '../interfaces';
import { merge } from 'rxjs';
import { curry } from 'ramda';
import { arrify } from '../utils';

type OnError = <R extends RpcRequest | RpcRequest[]>(
  err: Error,
  providers: Provider[],
  payload: R
) => Promise<RpcResponses<R>>;

interface MergeConfig {
  onError: OnError;
}

export const mergeProvidersWith = curry(
  (
    { onError }: MergeConfig,
    providers: (Subprovider | Provider)[]
  ): Provider => {
    return {
      send: payload => {
        const [provider, ...rest] = providers.filter(x => {
          if ('accept' in x) {
            return arrify(payload).every(req => x.accept(req));
          }
          return true;
        });

        if (!provider) {
          throw Error(`${payload} handler not found`);
        }

        return provider.send(payload).catch(err => onError(err, rest, payload));
      },
      disconnect: () => {
        providers.forEach(p => 'disconnect' in p && p.disconnect());
      },
      observe: (subId: string) => merge(...providers.map(x => x.observe(subId)))
    };
  }
);

export const mergeProviders = mergeProvidersWith({
  onError: err => Promise.reject(err)
});
