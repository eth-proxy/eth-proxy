import { map, mergeMap } from 'rxjs/operators';
import { MiddlewareItem } from '../model';
import {
  NumberLike,
  TransactionParams,
  EthSendTransactionRequest
} from '../../interfaces';
import { SubscribableOrPromise, from } from 'rxjs';
import { assocPath } from 'ramda';
import { toQuantity } from '../../converters';
import { forEachRequest } from '../utils';

export type GasPriceLoader = (
  req: TransactionParams
) => SubscribableOrPromise<NumberLike | undefined>;

export function gasPriceMiddleware(loader: GasPriceLoader): MiddlewareItem {
  const updateGas = assocPath<NumberLike, EthSendTransactionRequest>([
    'params',
    0,
    'gasPrice'
  ]);

  return forEachRequest((payload, next) => {
    if (payload.method !== 'eth_sendTransaction') {
      return next(payload);
    }

    return from(loader(payload.params[0])).pipe(
      map(amount => {
        if (!amount) {
          return payload;
        }

        const gasPrice = toQuantity(amount);

        return updateGas(gasPrice, payload);
      }),
      mergeMap(next)
    );
  });
}
