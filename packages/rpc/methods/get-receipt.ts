import { curry } from 'ramda';
import { send } from '../utils';
import { TransactionReceipt, Provider } from '../interfaces';
import { fromReceipt } from '../converters';

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionreceipt
 */
export const getReceipt = curry(
  (provider: Provider, txHash: string): Promise<TransactionReceipt> => {
    return send(provider)({
      method: 'eth_getTransactionReceipt',
      params: [txHash]
    }).then(fromReceipt);
  }
);
