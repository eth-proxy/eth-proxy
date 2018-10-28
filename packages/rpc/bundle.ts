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
  provider: Promise<Provider>,
  {
    methods,
    watches
  }: {
    methods: M;
    watches: W;
  }
): RpcBundle<M, W> {
  return {
    ...map(
      method => (...args) => {
        return provider.then(provider => method(provider, ...args));
      },
      methods
    ),
    ...map(
      watch => (...args) => {
        return from(provider).pipe(
          mergeMap(provider => watch(provider, ...args))
        );
      },
      watches
    )
  } as any;
}

export function rpc(provider: Promise<Provider>) {
  return createRpc(provider, {
    methods: allMethods,
    watches: allWatches
  });
}
