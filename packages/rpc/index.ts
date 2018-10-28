import { Observable } from 'rxjs';
import { mergeMap, first } from 'rxjs/operators';
import { mapObjIndexed } from 'ramda';
import * as allMethods from './methods';
import { ProviderBound, Provider } from './interfaces';

type Methods = {
  [name: string]: (provider: Provider, ...args: any[]) => Observable<any>;
};

export type RpcBundle<T extends Methods> = {
  [P in keyof T]: ProviderBound<T[P]>
};

export function rpc(provider: Observable<Provider>) {
  return createRpc(provider, allMethods);
}

export function createRpc<T extends Methods>(
  provider: Observable<Provider>,
  methods: T
): RpcBundle<T> {
  return mapObjIndexed((method: any) => {
    return (...args: any[]) => {
      return provider.pipe(
        first(),
        mergeMap(provider => method(provider, ...args))
      );
    };
  }, methods) as any;
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
  arrify,
  send
} from './utils';
export { TransactionInput } from './methods/request/send-transaction';
export { CallInput } from './methods/request/send-call';
export { DeploymentInput } from './methods/request/deploy';
export * from './providers';
