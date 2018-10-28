import { curry } from 'ramda';

import { send, ethHexToBN } from '../utils';
import { Provider, Tag } from '../interfaces';

interface GetBalanceRequest {
  account: string;
  atBlock?: Tag;
}

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getbalance
 */
export const getBalance = curry(
  (provider: Provider, { account, atBlock = 'latest' }: GetBalanceRequest) => {
    return send(provider)({
      method: 'eth_getBalance',
      params: [account, atBlock]
    }).then(ethHexToBN);
  }
);
