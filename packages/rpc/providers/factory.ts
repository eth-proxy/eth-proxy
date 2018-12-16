import { Provider, Subprovider, RpcRequest, RpcResponse } from '../interfaces';
import { merge } from 'rxjs';

type OnError = (
  err: Error,
  providers: Provider[],
  payload: RpcRequest
) => Promise<RpcResponse>;

interface MergeConfig {
  onError: OnError;
}

export function mergeProviders(
  providers: (Subprovider | Provider)[],
  { onError = Promise.reject }: MergeConfig
): Provider {
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

export const providerRetry = (
  err: Error,
  providers: Provider[],
  payload: RpcRequest
) => {
  const [provider, ...rest] = providers;
  if (!provider) {
    return Promise.reject(err);
  }
  return provider.send(payload).catch(err => providerRetry(err, rest, payload));
};
