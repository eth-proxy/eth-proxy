import { curry } from 'ramda';
import { send } from '../utils';
import { Observable } from 'rxjs';
import { TransactionReceipt, Provider } from '../interfaces';
import { map } from 'rxjs/operators';
import { fromReceipt } from '../formatters';

export const getReceipt = curry(
  (
    provider: Provider,
    txHash: string
  ): Observable<TransactionReceipt | null> => {
    return send(provider)({
      method: 'eth_getTransactionReceipt',
      params: [txHash]
    }).pipe(map(({ result }) => fromReceipt(result)));
  }
);
