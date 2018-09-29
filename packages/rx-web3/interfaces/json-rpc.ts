import { RawBlock } from './raw-entities';

export type Data = string;
export type Quantity = string;
export type Tag = 'latest' | 'earliest' | 'pending';

export interface BaseRpcRequest {
  // Should be included but usually are added by provider
  // jsonrpc: '2.0';
  // id: number;
  method: string;
  params: any;
}

export interface RpcResponse<T> {
  id: string;
  jsonrpc: '2.0';
  result: T;
}

export interface ContractRequestParams {
  from: Data;
  to: Data;
  gas: Quantity;
  gasPrice: Quantity;
  value: Quantity;
  data: Data;
}

export interface TransactionParams extends ContractRequestParams {
  nonce: Quantity;
}

export interface Rpc<Request extends BaseRpcRequest, Result> {
  type: Request['method'];
  request: Request;
  response: RpcResponse<Result>;
}

// JSON RPC METHODS

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call
 */
export interface EthCallRequest extends BaseRpcRequest {
  method: 'eth_call';
  params: [ContractRequestParams, Quantity | Tag];
}
export type EthCall = Rpc<EthCallRequest, Data>;

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction
 */
export interface EthSendTransactionRequest extends BaseRpcRequest {
  method: 'eth_sendTransaction';
  params: [TransactionParams];
}
export type EthSendTransaction = Rpc<EthSendTransactionRequest, Data>;

/**
 * https://github.com/ethereum/go-ethereum/wiki/Management-APIs#personal_sign
 */
export interface PersonalSignRequest extends BaseRpcRequest {
  method: 'personal_sign';
  params: [Data, Data];
}
export type PersonalSign = Rpc<PersonalSignRequest, Data>;

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbyhash
 */
export interface GetBlockByNumberRequest extends BaseRpcRequest {
  method: 'eth_getBlockByNumber';
  params: [Quantity | Tag, boolean];
}
export type EthGetBlockByNumber = Rpc<GetBlockByNumberRequest, RawBlock>;

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbyhash
 */
export interface GetBlockByHashRequest extends BaseRpcRequest {
  method: 'eth_getBlockByHash';
  params: [Data, boolean];
}
export type EthGetBlockByHash = Rpc<GetBlockByHashRequest, RawBlock>;

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_accounts
 */
export interface EthAccountsRequest extends BaseRpcRequest {
  method: 'eth_accounts';
  params: [];
}
export type EthAccounts = Rpc<EthAccountsRequest, Data[]>;

export type RpcMethod =
  | EthCall
  | EthSendTransaction
  | PersonalSign
  | EthGetBlockByNumber
  | EthGetBlockByHash
  | EthAccounts;

export type RpcRequest = RpcMethod['request'];
