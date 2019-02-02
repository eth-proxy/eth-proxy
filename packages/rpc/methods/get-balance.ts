import { curry } from 'ramda';

import { send, ethHexToBN } from 'rpc/utils';
import { Provider, Tag, NumberLike } from 'rpc/interfaces';
import { toBlockNr } from 'rpc/converters';

interface GetBalanceRequest {
  account: string;
  atBlock?: Tag | NumberLike;
}

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getbalance
 */
export const getBalance = curry(
  (provider: Provider, { account, atBlock = 'latest' }: GetBalanceRequest) => {
    return send(provider)({
      method: 'eth_getBalance',
      params: [account, toBlockNr(atBlock)]
    }).then(ethHexToBN);
  }
);
