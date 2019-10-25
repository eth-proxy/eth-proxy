import { defer, throwError, of } from 'rxjs';
import { curry } from 'ramda';
import {
  Provider,
  TransactionReceipt,
  TransactionStatus
} from 'rpc/interfaces';
import { getReceipt } from 'rpc/methods';
import { retryWhen, delay, take, concat, mergeMap } from 'rxjs/operators';
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
      retryWhen<TransactionReceipt>(err =>
        err.pipe(
          delay(interval),
          take(attempts),
          concat(throwError('Transaction was not found'))
        )
      ),
      mergeMap(receipt => {
        return receipt.status === TransactionStatus.Failure
          ? throwError('Transaction failed onchain')
          : of(receipt);
      })
    );
  }
);
