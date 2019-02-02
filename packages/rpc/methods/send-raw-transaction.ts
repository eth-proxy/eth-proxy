import { curry } from 'ramda';
import { send } from 'rpc/utils';
import { Provider } from 'rpc/interfaces';

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendrawtransaction
 */
export const sendRawTransaction = curry((provider: Provider, data: string) => {
  return send(provider)({
    method: 'eth_sendRawTransaction',
    params: [data]
  });
});
