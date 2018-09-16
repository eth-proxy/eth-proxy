import { curry, evolve } from 'ramda';
import { createWeb3, strip0x } from '../utils';
import { CurriedFunction2 } from 'ramda';
import { Observable } from 'rxjs';
import { TransactionReceipt, Provider } from '../interfaces';
import * as Web3 from 'web3';

// It should be probably done by web3, same way like rest of receipt, but as for (0.20.3) its not done
const decodeStatus = (status: string) =>
  new Web3().toBigNumber(strip0x(status)).toNumber();

export const getReceipt = curry(
  (provider: Provider, txHash: string): Observable<TransactionReceipt> => {
    return Observable.create(observer => {
      createWeb3(provider).eth.getTransactionReceipt(txHash, (err, receipt) => {
        if (err || !receipt) {
          observer.error(err);
          return;
        }
        observer.next(evolve({ status: decodeStatus }, receipt));
        observer.complete();
      });
    });
  }
);
