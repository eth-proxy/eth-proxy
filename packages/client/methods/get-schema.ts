import {
  createRequest,
  createMethod,
  AbiDefinition,
  BaseRpcRequest,
  Rpc
} from '@eth-proxy/rpc';

export const GET_SCHEMA = 'eth-proxy_getSchema';

/**
 * Custom client method
 */
export interface EthProxyGetSchemaRequest extends BaseRpcRequest {
  method: typeof GET_SCHEMA;
  params: [GetSchemaInput];
}

export type EthProxyGetSchema = Rpc<EthProxyGetSchemaRequest, ContractInfo>;

interface GetSchemaInput {
  contractName: string;
}

export function toRequest(request: { contractName: string }) {
  return {
    method: GET_SCHEMA,
    params: [request]
  };
}

const def = {
  request: toRequest,
  result: (schema: ContractInfo) => schema
};

export const getSchemaReq = createRequest(def);
export const getSchema = createMethod(def);

export interface ContractInfo {
  address: string;
  name: string;
  genesisBlock: number;
  abi: AbiDefinition[];
  bytecode?: string;
}
