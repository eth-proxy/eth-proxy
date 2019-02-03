export interface BaseRpcRequest {
  jsonrpc?: '2.0';
  id?: number;
  method: string;
  params: any;
}

export interface RpcError {
  code: number;
  message: string;
}

export interface BaseRpcResponse<T = any> {
  id?: number;
  jsonrpc?: '2.0';
  result: T;
  error?: RpcError;
}

export interface Rpc<Request extends BaseRpcRequest, Result> {
  type: Request['method'];
  request: Request;
  response: BaseRpcResponse<Result>;
}

export interface SubscriptionData<T = any> {
  jsonrpc?: '2.0';
  method: 'eth_subscription';
  params: {
    subscription: string;
    result: T;
  };
}
