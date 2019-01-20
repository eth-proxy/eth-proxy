import { RpcRequest, RpcResponse, Rpc } from '@eth-proxy/rpc';

export const RPC_REQUEST = 'request';

export interface RpcRequestAction<T extends Rpc<any, any>> {
  type: typeof RPC_REQUEST;
  method: T['request']['method'];
  payload: {
    request: T['request']['params'];
  };
}

export function toRequest<T extends RpcRequest>({ method, params }: T) {
  return {
    type: RPC_REQUEST,
    method,
    payload: {
      request: params
    }
  };
}

export const RPC_RESPONSE_SUCCESS = 'response_success';

export interface RpcResponseAction<T extends Rpc<any, any>> {
  type: typeof RPC_RESPONSE_SUCCESS;
  method: T['request']['method'];
  payload: {
    request: T['request']['params'];
    result: T['response']['result'];
  };
}

export function toResponseSuccess(
  { method, params }: RpcRequest,
  { result }: RpcResponse
) {
  return {
    type: RPC_RESPONSE_SUCCESS,
    method,
    payload: {
      request: params,
      result
    }
  };
}

export const RPC_RESPONSE_ERROR = 'response_error';

export interface RpcResponseErrorAction<T extends Rpc<any, any>> {
  type: typeof RPC_RESPONSE_ERROR;
  method: T['request']['method'];
  payload: {
    request: T['request']['params'];
    error: any;
  };
}

export function toResponseFailed(
  { method, params }: RpcRequest,
  { error }: RpcResponse
) {
  return {
    type: RPC_RESPONSE_ERROR,
    method,
    payload: {
      request: params,
      error
    }
  };
}

export type Types<T extends Rpc<any, any>> =
  | RpcRequestAction<T>
  | RpcResponseAction<T>
  | RpcResponseErrorAction<T>;

// export function isAction<
//   M extends RpcRequest['method'],
//   T extends Types<RpcRequest>['type']
// >(method: M, type: T) {
//   return <A extends any>(action: A): action is Extract<A, { type: T }> =>
//     action.method === method && action.type === type;
// }

// const a = undefined as any as Types<RpcRequest>
// if(isAction('eth_getBlockByNumber', 'request')(a)) {
//   a.
// }

// type X = Extract<Types<RpcRequest>, { type: 'request' } >

// type RequestOf<R> = R extends { method: infer M } ? Extract<RpcRequest, { type: M }> : never
