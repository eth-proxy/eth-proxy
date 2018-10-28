import { curry } from 'ramda';
import { map } from 'rxjs/operators';

import { send, ethHexToBN } from '../utils';
import { Provider, Tag } from '../interfaces';

interface GetBalanceRequest {
  account: string;
  atBlock?: Tag;
}

export const getBalance = curry(
  (provider: Provider, { account, atBlock = 'latest' }: GetBalanceRequest) => {
    return send(provider)({
      method: 'eth_getBalance',
      params: [account, atBlock]
    }).pipe(map(ethHexToBN));
  }
);
