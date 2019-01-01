import { createRequest, createMethod } from '../utils';
import { SubscribeArgs, EthSubscribe } from '../interfaces';

export const toRequest = (x: SubscribeArgs): EthSubscribe['request'] => {
  return {
    method: 'eth_subscribe',
    params: [x.type, ...('args' in x ? [x.args] : [])] as any
  };
};

const subscribeDef = {
  request: toRequest,
  result: (res: EthSubscribe['response']['result']) => res
};

/**
 * https://github.com/ethereum/go-ethereum/wiki/RPC-PUB-SUB#create-subscription
 */
export const subscribeReq = createRequest(subscribeDef);

/**
 * https://github.com/ethereum/go-ethereum/wiki/RPC-PUB-SUB#create-subscription
 */
export const subscribe = createMethod(subscribeDef);
