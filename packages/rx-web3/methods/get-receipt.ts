import { curry, evolve } from 'ramda';
import * as Web3 from 'web3';
import { createWeb3, bind } from '../utils';
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback';
import { CurriedFunction2 } from 'ramda';
import { Observable } from 'rxjs/Observable';

// It should be probably done by web3, same way like rest of receipt, but as for (0.20.3) its not done
const decodeStatus = (status: string) =>
  new Web3().toBigNumber(status.replace(/^0x/, '')).toNumber();

export const getReceipt = curry(
  (
    provider: Web3.Provider,
    txHash: string
  ): Observable<Web3.TransactionReceipt> => {
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
