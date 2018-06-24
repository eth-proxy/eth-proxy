/// <reference path="typings.d.ts" />
import * as Web3 from 'web3';
import { Observable } from 'rxjs';
import { mergeMap, first } from 'rxjs/operators';
import { mapObjIndexed } from 'ramda';
import * as allMethods from './methods';
import { ProviderBound } from './interfaces';

export type RxWeb3 = {
  [P in keyof typeof allMethods]: ProviderBound<typeof allMethods[P]>
};

export function createRxWeb3(provider: Observable<Web3.Provider>): RxWeb3 {
  return mapObjIndexed((method: any) => {
    return (...args: any[]) => {
      return provider.pipe(
        first(),
        mergeMap(provider => method(provider, ...args))
      );
    };
  }, allMethods) as any;
}

export * from './methods';
export * from './interfaces';
export { sha3 } from './utils';
