import {
  MiddlewareItem,
  forEachRequest,
  sendTransactionReq,
  Provider,
  TransactionInput,
  isFunctionAbi
} from '@eth-proxy/rpc';
import { from } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { getSchema } from '../methods/get-schema';
import { evolve } from 'ramda';
import {
  ETH_PROXY_TRANSACTION,
  EthProxyTransactionRequest
} from '../methods/proxy-transaction';

interface Context {
  getProvider: () => Provider;
}

export function proxyTransactionMiddleware({
  getProvider
}: Context): MiddlewareItem {
  return forEachRequest((request, next) => {
    if (request.method !== (ETH_PROXY_TRANSACTION as string)) {
      return next(request);
    }

    const {
      address: maybeAddress,
      method,
      payload,
      interface: contractName,
      ...txParams
    } = ((request as unknown) as EthProxyTransactionRequest).params[0];

    return from(getSchema(getProvider(), { contractName })).pipe(
      mergeMap(({ abi, address }) => {
        const input: TransactionInput<any> = {
          abi: abi.filter(isFunctionAbi).find(x => x.name === method)!,
          args: payload,
          txParams: {
            ...txParams,
            to: maybeAddress || address
          }
        };
        const { parseResult, payload: rawCallPayload } = sendTransactionReq(
          input
        );

        return next(rawCallPayload).pipe(map(evolve({ result: parseResult })));
      })
    );
  });
}
