import { head } from 'ramda';

import { send } from '../utils';
import { Provider } from '../interfaces';

export function getDefaultAccount(provider: Provider) {
  return getAccounts(provider).then(accounts => head(accounts) || null);
}

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getaccounts
 */
export function getAccounts(provider: Provider) {
  return send(provider)({
    method: 'eth_accounts',
    params: []
  });
}
