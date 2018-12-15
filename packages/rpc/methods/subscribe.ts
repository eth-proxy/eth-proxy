import { send } from '../utils';
import { curry } from 'ramda';
import { Provider, SubscribeArgs } from '../interfaces';

export const subscribe = curry((provider: Provider, x: SubscribeArgs) => {
  return send(provider)({
    method: 'eth_subscribe',
    params: [x.type, ...('args' in x ? [x.args] : [])] as any
  });
});
