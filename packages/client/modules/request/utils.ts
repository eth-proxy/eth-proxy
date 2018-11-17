import { methodProxy } from './contract-proxy';
import { RequestOptions } from './model';

export function at<T extends {}>(contractProxy: T, address: string): T {
  const current = Object.assign({ address }, (contractProxy as any).fake());
  return new Proxy(current, methodProxy);
}

export const withOptions = <T extends {}>(
  request: T,
  options: RequestOptions
): T => {
  return Object.assign({}, request, options);
};
