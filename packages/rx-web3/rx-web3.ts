import { mapObjIndexed } from 'ramda';
import * as allMethods from './methods';
import { ProviderBound, Provider } from './interfaces';

export type RxWeb3 = {
  [P in keyof typeof allMethods]: ProviderBound<typeof allMethods[P]>
};

export function createRxWeb3(provider: Provider): RxWeb3 {
  return mapObjIndexed((method: any) => {
    return (...params: any[]) => method(...params, provider);
  }, allMethods) as any;
}
