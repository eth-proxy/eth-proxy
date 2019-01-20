import { moduleId } from './constants';
import * as actions from '../../actions';
import { EthAccounts } from '@eth-proxy/rpc';

export type State = string | null;

export function reducer(
  state: State = null,
  action: actions.Types<EthAccounts>
): State {
  if (action.method === 'eth_accounts' && action.type === 'response_success') {
    const [defaultAccount] = action.payload.result;
    return defaultAccount || null;
  }
  return state;
}

export const getSelectors = <T = { [moduleId]: State }>(
  getModule: (state: T) => State
) => {
  return {
    getActiveAccount: getModule
  };
};

export const { getActiveAccount } = getSelectors(x => x[moduleId]);
