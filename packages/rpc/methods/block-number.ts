import { send, ethHexToNumber } from '../utils';
import { Provider } from '../interfaces';

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_blocknumber
 */
export function blockNumber(provider: Provider) {
  return send(provider)({
    method: 'eth_blockNumber',
    params: []
  }).then(ethHexToNumber);
}
