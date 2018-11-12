export interface BaseRpcRequest {
  jsonrpc?: '2.0';
  id?: number;
  method: string;
  params: any;
}

export interface BaseRpcResponse<T = any> {
  id?: number;
  jsonrpc?: '2.0';
  result: T;
}

export interface Rpc<Request extends BaseRpcRequest, Result> {
  type: Request['method'];
  request: Request;
  response: BaseRpcResponse<Result>;
}
