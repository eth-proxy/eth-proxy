import { send } from '../utils';
import { Provider } from '../interfaces';

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#net_version
 */
export function getNetwork(provider: Provider) {
  return send(provider)({
    method: 'net_version',
    params: []
  });
}
