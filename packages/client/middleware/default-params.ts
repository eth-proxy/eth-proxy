import { curry, omit } from 'ramda';
import { MiddlewareItem, forEachRequest } from '@eth-proxy/rpc';
import { SubscribableOrPromise, combineLatest } from 'rxjs';
import {
  ETH_PROXY_TRANSACTION,
  EthProxyTransactionRequest
} from '../methods/proxy-transaction';
import { map } from 'rxjs/operators';

export const omitCustomProps = omit(['interface', 'method', 'payload']);

export function txParamsValid(params: any) {
  return !!params.from;
}

export const mergeParams = curry((tx_params: any, defaultTxParams: any) => {
  return {
    ...defaultTxParams,
    ...omitCustomProps(tx_params)
  };
});

interface Context {
  getFrom: () => SubscribableOrPromise<string>;
  getGasLimit: () => SubscribableOrPromise<string>;
}

export function txDefaultsMiddleware({
  getFrom,
  getGasLimit
}: Context): MiddlewareItem {
  return forEachRequest((request, next) => {
    if (request.method !== (ETH_PROXY_TRANSACTION as string)) {
      return next(request);
    }
    const txRequest = (request as unknown) as EthProxyTransactionRequest;
    const txRequestParams = txRequest.params[0];

    return combineLatest(getFrom(), getGasLimit()).pipe(
      map(([from, gas]) => {
        const updatedParams = {
          from,
          gas,
          ...txRequestParams
        };

        return {
          ...txRequest,
          params: [updatedParams]
        } as any;
      })
    );
  });
}
