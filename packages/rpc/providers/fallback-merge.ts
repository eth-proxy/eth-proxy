import { Provider, RpcRequest } from '../interfaces';
import { mergeProvidersWith } from './merge';

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

export const fallbackMergeProviders = mergeProvidersWith({
  onError: providerRetry
});
