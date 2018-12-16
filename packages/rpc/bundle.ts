import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { map } from 'ramda';
import * as allMethods from './methods';
import * as allWatches from './watches';
import { ProviderBound, Provider } from './interfaces';

type Methods = {
  [name: string]: (provider: Provider, ...args: any[]) => Promise<any>;
};
type Watches = {
  [name: string]: (provider: Provider, ...args: any[]) => Observable<any>;
};

export type RpcBundle<M extends Methods, W extends Watches> = {
  [P in keyof M]: ProviderBound<M[P]>
} &
  { [P in keyof W]: ProviderBound<W[P]> };

export function createRpc<M extends Methods, W extends Watches>(
  provider: Provider,
  {
    methods,
    watches
  }: {
    methods: M;
    watches: W;
  }
): RpcBundle<M, W> {
  return {
    ...map(method => (...args) => method(provider, ...args), methods),
    ...map(watch => (...args) => watch(provider, ...args), watches)
  } as any;
}

export function rpc(provider: Provider) {
  return createRpc(provider, {
    methods: allMethods,
    watches: allWatches
  });
}
