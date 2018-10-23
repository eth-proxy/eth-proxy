import { send } from '../utils';
import { Provider } from '../interfaces';

export function getNetwork(provider: Provider) {
  return send(provider)({
    method: 'net_version',
    params: []
  });
}
