import { Provider, Subprovider, RpcRequest, RpcResponse } from '../interfaces';
import { merge } from 'rxjs';
import { curry } from 'ramda';

type OnError = (
  err: Error,
  providers: Provider[],
  payload: RpcRequest
) => Promise<RpcResponse>;

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
        if (Array.isArray(payload)) {
          throw Error('Batch not suppoted');
        }

        const [provider, ...rest] = providers.filter(x =>
          'accept' in x ? x.accept(payload) : true
        );

        if (!provider) {
          throw Error(`${payload.method} handler not found`);
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
