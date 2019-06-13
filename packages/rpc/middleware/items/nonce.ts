import { map, mergeMap, tap } from 'rxjs/operators';
import { MiddlewareItem } from '../model';
import { NumberLike, EthSendTransactionRequest } from 'rpc/interfaces';
import { from } from 'rxjs';
import { assocPath } from 'ramda';
import { toQuantity } from 'rpc/converters';
import { NonceTracker } from '../../tools';

export function nonceMiddleware(tracker: NonceTracker): MiddlewareItem {
  const updateNonce = assocPath<NumberLike, EthSendTransactionRequest>([
    'params',
    0,
    'nonce'
  ]);

  return (payload, next) => {
    if (payload.method !== 'eth_sendTransaction') {
      return next(payload);
    }
    const { from: account, nonce: presetNonce } = payload.params[0];

    if (presetNonce) {
      return next(payload);
    }

    return from(tracker.up(account)).pipe(
      map(nonce => updateNonce(toQuantity(nonce), payload)),
      mergeMap(next),
      tap({
        error: () => tracker.down(account)
      })
    );
  };
}
