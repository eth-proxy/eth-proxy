import { Request } from '../modules/request';
import {
  RequestDef,
  BaseRpcRequest,
  Rpc,
  Quantity,
  Tag,
  Data,
  Provider,
  send
} from '@eth-proxy/rpc';
import { curry } from 'ramda';

export const ETH_PROXY_CALL = 'eth-proxy_call';
/**
 * Custom client method
 */
export interface EthProxyCallRequest extends BaseRpcRequest {
  method: typeof ETH_PROXY_CALL;
  params: [Request<string, string, any>, Quantity | Tag];
}

export type EthProxyCall = Rpc<EthProxyCallRequest, Data>;

export function toRequest(
  request: Request<string, string, any>
): EthProxyCallRequest {
  return {
    method: ETH_PROXY_CALL,
    params: [request, 'latest']
  };
}

export const proxyCallReq = <R extends Request<string, string, any>>(
  input: R
): RequestDef<EthProxyCall, any> => {
  return {
    payload: toRequest(input),
    parseResult: x => x
  };
};

export const proxyCall = curry(
  (provider: Provider, input: Request<string, string, any>) => {
    const payload = toRequest(input) as any;
    return send(provider)(payload);
  }
);
