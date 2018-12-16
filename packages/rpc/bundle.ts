import { map } from 'ramda';
import * as methods from './methods';
import * as watches from './watches';
import * as subscriptions from './subscriptions';
import { ProviderBound, Provider } from './interfaces';

export type RpcBundle<M> = { [P in keyof M]: ProviderBound<M[P]> };

export function createCustomRpc<M>(
  provider: Provider,
  methods: M
): RpcBundle<M> {
  return {
    ...map((method: any) => (...args) => method(provider, ...args), methods)
  } as any;
}

export function createRpc(
  provider: Provider
): RpcBundle<typeof methods & typeof watches & typeof subscriptions> {
  return createCustomRpc(provider, {
    ...methods,
    ...watches,
    ...subscriptions
  });
}
