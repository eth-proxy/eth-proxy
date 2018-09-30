import { curry, isNil } from 'ramda';
import { send } from '../utils';
import { Observable } from 'rxjs';
import { Provider, Transaction, RawTransaction } from '../interfaces';
import { map, tap } from 'rxjs/operators';
import { fromTransaction } from '../formatters';

export const getTransactionByHash = curry(
  (provider: Provider, txHash: string): Observable<Transaction> => {
    return send(provider)({
      method: 'eth_getTransactionByHash',
      params: [txHash]
    }).pipe(
      map(x => x.result),
      tap(validateTransaction),
      map(fromTransaction)
    );
  }
);

function validateTransaction(tx: RawTransaction) {
  if (isNil(tx)) {
    throw Error('Transaction is nil');
  }
  return tx;
}
