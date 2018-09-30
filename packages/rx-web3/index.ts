/// <reference path="typings.d.ts" />
import { Observable } from 'rxjs';
import { mergeMap, first } from 'rxjs/operators';
import { mapObjIndexed } from 'ramda';
import * as allMethods from './methods';
import { ProviderBound, Provider } from './interfaces';

export type RxWeb3 = {
  [P in keyof typeof allMethods]: ProviderBound<typeof allMethods[P]>
};

export function createRxWeb3(provider: Observable<Provider>): RxWeb3 {
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
export {
  sha3,
  toSignatureHash,
  toAscii,
  toHex,
  fromAscii,
  getFunction,
  isEventAbi,
  isConstructorAbi,
  arrify
} from './utils';
export { TransactionInput } from './methods/request/send-transaction';
export { CallInput } from './methods/request/send-call';
export { DeploymentInput } from './methods/request/deploy';
export * from './providers';
