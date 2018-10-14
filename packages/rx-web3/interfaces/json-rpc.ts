import {
  RawBlock,
  RawTransaction,
  RawTransactionReceipt,
  RawLog,
  RawFilter
} from './raw-entities';

export type Data = string;
export type Quantity = string;
export type Tag = 'latest' | 'earliest' | 'pending';

export interface BaseRpcRequest {
  jsonrpc?: '2.0';
  id?: number;
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

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getbalance
 */
export interface EthGetBalanceRequest extends BaseRpcRequest {
  method: 'eth_getBalance';
  params: [Data, Quantity | Tag];
}
export type EthGetBalance = Rpc<EthGetBalanceRequest, Quantity>;

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#net_version
 */
export interface NetVersionRequest extends BaseRpcRequest {
  method: 'net_version';
  params: [];
}
export type NetVersion = Rpc<NetVersionRequest, string>;

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionreceipt
 */
export interface EthGetTransactionReceiptRequest extends BaseRpcRequest {
  method: 'eth_getTransactionReceipt';
  params: [Data];
}
export type EthGetTransactionReceipt = Rpc<
  EthGetTransactionReceiptRequest,
  RawTransactionReceipt
>;

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionbyhash
 */
export interface EthGetTransactionByHashRequest extends BaseRpcRequest {
  method: 'eth_getTransactionByHash';
  params: [Data];
}
export type EthGetTransactionByHash = Rpc<
  EthGetTransactionByHashRequest,
  RawTransaction
>;

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getlogs
 */
export interface EthGetLogsRequest extends BaseRpcRequest {
  method: 'eth_getLogs';
  params: [RawFilter];
}
export type EthGetLogs = Rpc<EthGetLogsRequest, RawLog[]>;

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_newblockfilter
 */
export interface EthNewBlockFilterRequest extends BaseRpcRequest {
  method: 'eth_newBlockFilter';
  params: [];
}
export type EthNewBlockFilter = Rpc<EthNewBlockFilterRequest, Data>;

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getfilterchanges
 */
export interface EthGetFilterChangesRequest extends BaseRpcRequest {
  method: 'eth_getFilterChanges';
  params: [Data];
}
export type EthGetFilterChanges = Rpc<
  EthGetFilterChangesRequest,
  Data[] | RawLog[]
>;

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_uninstallfilter
 */
export interface EthUninstallFilterRequest extends BaseRpcRequest {
  method: 'eth_uninstallFilter';
  params: [Data];
}
export type EthUninstallFilter = Rpc<EthUninstallFilterRequest, boolean>;

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_newfilter
 */
export interface EthNewFilterRequest extends BaseRpcRequest {
  method: 'eth_newFilter';
  params: [RawFilter];
}
export type EthNewFilter = Rpc<EthNewFilterRequest, Data>;

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getFilterLogs
 */
export interface EthGetFilterLogsRequest extends BaseRpcRequest {
  method: 'eth_getFilterLogs';
  params: [Data];
}
export type EthGetFilterLogs = Rpc<EthGetFilterLogsRequest, RawLog[]>;

export type RpcMethod =
  | EthCall
  | EthSendTransaction
  | EthGetBlockByNumber
  | EthGetBlockByHash
  | EthAccounts
  | EthGetBalance
  | EthGetTransactionReceipt
  | EthGetTransactionByHash
  | EthGetLogs
  | EthNewBlockFilter
  | EthNewFilter
  | EthGetFilterChanges
  | EthUninstallFilter
  | EthGetFilterLogs
  | PersonalSign
  | NetVersion;

export type RpcRequest = RpcMethod['request'];
