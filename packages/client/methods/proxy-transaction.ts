import { Request } from '../modules/request';
import {
  RequestDef,
  BaseRpcRequest,
  Rpc,
  Data,
  Provider,
  send
} from '@eth-proxy/rpc';
import { curry } from 'ramda';

export const ETH_PROXY_TRANSACTION = 'eth-proxy_transaction';
/**
 * Custom client method
 */
export interface EthProxyTransactionRequest extends BaseRpcRequest {
  method: typeof ETH_PROXY_TRANSACTION;
  params: [Request<string, string, any>];
}

export type EthProxyTransaction = Rpc<EthProxyTransactionRequest, Data>;

export function toRequest(
  request: Request<string, string, any>
): EthProxyTransactionRequest {
  return {
    method: ETH_PROXY_TRANSACTION,
    params: [request]
  };
}

export const proxyTransactionReq = <R extends Request<string, string, any>>(
  input: R
): RequestDef<EthProxyTransaction, any> => {
  return {
    payload: toRequest(input),
    parseResult: (x: string) => x
  };
};

export const proxyTransaction = curry(
  (provider: Provider, input: Request<string, string, any>) => {
    const payload = toRequest(input) as any;
    return send(provider)(payload);
  }
);
