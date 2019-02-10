import {
  RpcRequest,
  RpcResponse,
  Rpc,
  RpcMethod,
  SubscriptionData,
  RpcSubscriptionEvent
} from '@eth-proxy/rpc';

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

export const RPC_SUBSCRIPTION = 'rpc_subscription';

export interface RpcSubscriptionAction<T extends RpcSubscriptionEvent> {
  type: typeof RPC_RESPONSE_ERROR;
  method: T['method'];
  payload: T['data']['params']['result'];
}

export function toSubscription(method: string, data: SubscriptionData) {
  return {
    type: RPC_SUBSCRIPTION,
    method,
    payload: data
  };
}

export type RpcSubscriptionActions = {
  [P in RpcSubscriptionEvent['method']]: RpcSubscriptionAction<
    Extract<RpcSubscriptionEvent, { method: P }>
  >
};

type RpcActionType<T extends Rpc<any, any> = RpcMethod> =
  | RpcRequestAction<T>
  | RpcResponseAction<T>
  | RpcResponseErrorAction<T>;

type RpcActions = {
  [P in RpcRequest['method']]: RpcActionType<Extract<RpcMethod, { type: P }>>
};

export type Types =
  | RpcActions[keyof RpcActions]
  | RpcSubscriptionActions[keyof RpcSubscriptionActions];
