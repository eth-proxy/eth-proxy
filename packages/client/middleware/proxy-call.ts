import {
  MiddlewareItem,
  forEachRequest,
  sendCallReq,
  Provider,
  CallInput,
  isFunctionAbi
} from '@eth-proxy/rpc';
import { from } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { getSchema } from '../methods/get-schema';
import { evolve } from 'ramda';
import { ETH_PROXY_CALL } from '../methods/proxy-call';

interface Context {
  getProvider: () => Provider;
}

export function proxyCallMiddleware({ getProvider }: Context): MiddlewareItem {
  return forEachRequest((request, next) => {
    if (request.method !== (ETH_PROXY_CALL as string)) {
      return next(request);
    }

    const {
      address: maybeAddress,
      method,
      payload,
      interface: contractName,
      ...txParams
    } = request.params[0] as any;

    return from(getSchema(getProvider(), { contractName })).pipe(
      mergeMap(({ abi, address }) => {
        const input: CallInput<any> = {
          abi: abi.filter(isFunctionAbi).find(x => x.name === method)!,
          args: payload,
          txParams: {
            ...txParams,
            to: maybeAddress || address
          }
        };
        const { parseResult, payload: rawCallPayload } = sendCallReq(input);

        return next(rawCallPayload).pipe(map(evolve({ result: parseResult })));
      })
    );
  });
}
