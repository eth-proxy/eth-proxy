import { Provider, RpcRequest, RpcResponses } from '../interfaces';
import { mergeProvidersWith } from './merge';

export const providerRetry = <R extends RpcRequest | RpcRequest[]>(
  err: Error,
  providers: Provider[],
  payload: R
): Promise<RpcResponses<R>> => {
  const [provider, ...rest] = providers;
  if (!provider) {
    return Promise.reject(err);
  }
  return provider
    .send(payload)
    .catch(error => providerRetry(error, rest, payload));
};

export const fallbackMergeProviders = mergeProvidersWith({
  onError: providerRetry
});
