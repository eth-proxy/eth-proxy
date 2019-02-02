import { curry } from 'ramda';

import { send, ethHexToNumber } from 'rpc/utils';
import { toBlockNr } from 'rpc/converters';
import { Provider, Tag, NumberLike } from 'rpc/interfaces';

interface GetTransactionCountRequest {
  account: string;
  atBlock?: Tag | NumberLike;
}

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactioncount
 */
export const getTransactionCount = curry(
  (
    provider: Provider,
    { account, atBlock = 'latest' }: GetTransactionCountRequest
  ) => {
    return send(provider)({
      method: 'eth_getTransactionCount',
      params: [account, toBlockNr(atBlock)]
    }).then(ethHexToNumber);
  }
);
