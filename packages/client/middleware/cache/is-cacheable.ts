import { isTag } from '@eth-proxy/rpc';
import { ClientRequest } from 'client/interfaces';

const cachableMethods: ClientRequest['method'][] = [
  'eth_getBlockByHash',
  'eth-proxy_getSchema'
];

export const isCacheable = (payload: ClientRequest) => {
  return (
    cachableMethods.includes(payload.method) ||
    (payload.method === 'eth_getBlockByNumber' && !isTag(payload.params[0]))
  );
};
