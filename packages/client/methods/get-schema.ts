import {
  AbiDefinition,
  BaseRpcRequest,
  Rpc,
  Provider,
  send
} from '@eth-proxy/rpc';
import { curry } from 'ramda';

export const GET_SCHEMA = 'eth-proxy_getSchema';

/**
 * Custom client method
 */
export interface EthProxyGetSchemaRequest extends BaseRpcRequest {
  method: typeof GET_SCHEMA;
  params: [GetSchemaInput];
}

export type EthProxyGetSchema = Rpc<EthProxyGetSchemaRequest, ContractInfo>;

export interface GetSchemaInput {
  contractName: string;
}

function toRequest(request: { contractName: string }) {
  return {
    method: GET_SCHEMA,
    params: [request]
  };
}

export const getSchema = curry(
  (provider: Provider, contractName: string): Promise<ContractInfo> => {
    return send(provider)(toRequest({ contractName }) as any);
  }
);

export interface ContractInfo {
  address: string;
  name: string;
  genesisBlock: number;
  abi: AbiDefinition[];
  bytecode?: string;
}
