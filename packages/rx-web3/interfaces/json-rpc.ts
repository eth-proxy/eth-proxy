export type Data = string;
export type Quantity = string;
export type Tag = 'latest' | 'earliest' | 'pending';

interface BaseRpcRequest {
  // Should be included but usually are added by provider
  // jsonrpc: '2.0';
  // id: number;
  method: string;
  params: any;
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

// JSON RPC METHODS

export interface EthCall extends BaseRpcRequest {
  method: 'eth_call';
  params: [ContractRequestParams, Quantity | Tag];
}

export interface EthSendTransaction extends BaseRpcRequest {
  method: 'eth_sendTransaction';
  params: [TransactionParams];
}

export interface PersonalSign extends BaseRpcRequest {
  method: 'personal_sign';
  params: [Data, Data];
}

export type RpcRequest = EthCall | EthSendTransaction | PersonalSign;

export interface Method<Request, Response> {
  request: Request;
  response: Response;
}

export type RpcMethod =
  | Method<EthCall, Data>
  | Method<EthSendTransaction, Data>
  | Method<PersonalSign, Data>;
