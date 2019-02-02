import { defer, throwError } from 'rxjs';
import { curry } from 'ramda';
import { Provider } from '../interfaces';
import { getReceipt } from '../methods';
import { retryWhen, delay, take, concat } from 'rxjs/operators';
import { isString } from 'rpc/utils';

export type FindReceiptOptions =
  | string
  | {
      txHash: string;
      interval?: number;
      attempts?: number;
    };

export const findReceipt = curry(
  (provider: Provider, options: FindReceiptOptions) => {
    const { txHash, interval = 1000, attempts = 720 } = isString(options)
      ? { txHash: options }
      : options;

    return defer(() => getReceipt(provider, txHash)).pipe(
      retryWhen(err =>
        err.pipe(
          delay(interval),
          take(attempts),
          concat(throwError('Transaction was not found'))
        )
      )
    );
  }
);
