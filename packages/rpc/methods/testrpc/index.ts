import { send } from '../../utils';
import { Provider } from '../../interfaces';

/**
 * TESTRPC ONLY
 * https://github.com/trufflesuite/ganache-cli
 */
export function snapshot(provider: Provider) {
  return send(provider)({
    method: 'evm_snapshot',
    params: []
  });
}

/**
 * TESTRPC ONLY
 * https://github.com/trufflesuite/ganache-cli
 */
export function revert(provider: Provider) {
  return send(provider)({
    method: 'evm_snapshot',
    params: []
  });
}

/**
 * TESTRPC ONLY
 * https://github.com/trufflesuite/ganache-cli
 */
export function mine(provider: Provider) {
  return send(provider)({
    method: 'evm_mine',
    params: []
  });
}
