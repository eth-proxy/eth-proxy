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
import { isNotNil } from '../../utils';

export type GasLimitLoader = (
  req: TransactionParams
) => SubscribableOrPromise<NumberLike | undefined>;

export function gasLimitMiddleware(loader: GasLimitLoader): MiddlewareItem {
  const updateGas = assocPath<NumberLike, EthSendTransactionRequest>([
    'params',
    0,
    'gas'
  ]);

  return (payload, next) => {
    if (
      payload.method !== 'eth_sendTransaction' ||
      isNotNil(payload.params[0].gas)
    ) {
      return next(payload);
    }

    return from(loader(payload.params[0])).pipe(
      map(amount => {
        if (!amount) {
          return payload;
        }

        const gasLimit = toQuantity(amount);

        return updateGas(gasLimit, payload);
      }),
      mergeMap(next)
    );
  };
}
