import { send } from '../utils';
import { Provider } from '../interfaces';
import { map } from 'rxjs/operators';

export function getNetwork(provider: Provider) {
  return send(provider)({
    method: 'net_version',
    params: []
  });
}
