import { send } from '../../utils';
import { Provider } from '../../interfaces';
import { curry } from 'ramda';
import { toQuantity } from '../../converters';

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
export const revert = curry((provider: Provider, version: number) => {
  return send(provider)({
    method: 'evm_revert',
    params: [toQuantity(version)]
  });
});

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
