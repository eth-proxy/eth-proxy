import { RpcRequest, isTag } from '@eth-proxy/rpc';

const cachableMethods: RpcRequest['method'][] = ['eth_getBlockByHash'];

export const isCacheable = (payload: RpcRequest) => {
  return (
    cachableMethods.includes(payload.method) ||
    (payload.method === 'eth_getBlockByNumber' && !isTag(payload.params[0]))
  );
};
