import { send } from '../utils';
import { curry } from 'ramda';
import { Provider } from '../interfaces';

export const unsubscribe = curry(
  (provider: Provider, subscriptionId: string) => {
    return send(provider)({
      method: 'eth_unsubscribe',
      params: [subscriptionId]
    }).then(result => {
      if (result !== true) {
        throw Error('Unscubscribe failed');
      }
      return result;
    });
  }
);
