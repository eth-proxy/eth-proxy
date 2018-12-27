import { Provider, RpcRequest, RpcResponse } from '../interfaces';
import { mergeProvidersWith } from './merge';

export const providerRetry = (
  err: Error,
  providers: Provider[],
  payload: RpcRequest
): Promise<RpcResponse> => {
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
