import { map } from 'rxjs/operators';
import { head } from 'ramda';

import { send } from '../utils';
import { Provider } from '../interfaces';

export function getDefaultAccount(provider: Provider) {
  return getAccounts(provider).pipe(map(accounts => head(accounts) || null));
}

export function getAccounts(provider: Provider) {
  return send(provider)({
    method: 'eth_accounts',
    params: []
  });
}
