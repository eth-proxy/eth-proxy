import { curry, isNil } from 'ramda';
import { send } from '../utils';
import { Provider, RawTransaction } from '../interfaces';
import { fromTransaction } from '../converters';

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionbyhash
 */
export const getTransactionByHash = curry(
  (provider: Provider, txHash: string) => {
    return send(provider)({
      method: 'eth_getTransactionByHash',
      params: [txHash]
    })
      .then(validateTransaction)
      .then(fromTransaction);
  }
);

function validateTransaction(tx: RawTransaction) {
  if (isNil(tx)) {
    throw Error('Transaction is nil');
  }
  return tx;
}
