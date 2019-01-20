import { methodProxy } from './contract-proxy';
import { RequestOptions, Request } from './model';
import { curry } from 'ramda';

export function at<T extends {}>(address: string, contractProxy: T): T;
export function at(address: string): <T extends {}>(contractProxy: T) => T;
export function at(...args: [string, any?]) {
  return atAddress(...args);
}

export const atAddress = curry((address: string, contractProxy: string) => {
  const current = Object.assign({ address }, (contractProxy as any).fake());
  return new Proxy(current, methodProxy);
});

export function withOptions<T extends Request<any, any, any>>(
  options: RequestOptions,
  request: T
): T;
export function withOptions(
  options: RequestOptions
): <T extends Request<any, any, any>>(request: T) => T;
export function withOptions(...args: [RequestOptions, any?]) {
  return withRequestOptions(...args);
}
export const withRequestOptions = curry(
  (options: RequestOptions, request: any) => {
    return Object.assign({}, request, options);
  }
);
