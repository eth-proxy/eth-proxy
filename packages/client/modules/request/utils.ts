import { methodProxy } from './contract-proxy';
import { RequestOptions, Request } from './model';
import { omit, curry } from 'ramda';

interface AtAddress {
  (address: string): <T extends string>(contractProxy: T) => T;
  <T extends string>(address: string, contractProxy: T): T;
}
export const at: AtAddress = curry((address: string, contractProxy: any) => {
  const current = Object.assign({ address }, contractProxy.fake());
  return new Proxy(current, methodProxy);
});

interface WithOptions {
  (options: RequestOptions): <T extends Request<any, any, any>>(
    request: T
  ) => T;
  <T extends Request<any, any, any>>(options: RequestOptions, request: T): T;
}
export const withRequestOptions: WithOptions = curry(
  (options: RequestOptions, request: any) => {
    return Object.assign({}, request, options);
  }
);

export const omitCustomProps = omit(['interface', 'method', 'payload']);
