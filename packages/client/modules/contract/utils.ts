import { pick } from "ramda";
import { methodProxy } from "./contract-proxy";
import { RequestOptions } from './model'

const paramsKeys = ["from", "to", "gas", "gasPrice", "value"];
export const pickTxParamsProps = pick(paramsKeys);

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
