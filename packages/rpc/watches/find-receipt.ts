import { getTransactionByHash } from '../methods';
import { defer, throwError } from 'rxjs';
import { retryWhen, delay, take, concat } from 'rxjs/operators';
import { Provider } from '../interfaces';
import { curry } from 'ramda';

interface FindReceiptOptions {
  txHash: string;
  delayTime?: number;
  maxTries?: number;
}

export const findReceipt = curry(
  (
    provider: Provider,
    { txHash, delayTime = 1000, maxTries = 720 }: FindReceiptOptions
  ) => {
    return defer(() => getTransactionByHash(provider, txHash)).pipe(
      retryWhen(err =>
        err.pipe(
          delay(delayTime),
          take(maxTries),
          concat(throwError('Transaction was not processed within 720s'))
        )
      )
    );
  }
);
