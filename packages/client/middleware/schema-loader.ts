import { MiddlewareItem, forEachRequest } from '@eth-proxy/rpc';
import { from, SubscribableOrPromise } from 'rxjs';
import { map } from 'rxjs/operators';
import { GET_SCHEMA, ContractInfo } from '../methods/get-schema';

interface Context {
  schemaLoader: (
    { name }: { name: string }
  ) => SubscribableOrPromise<ContractInfo>;
}

export function schemaLoaderMiddleware({
  schemaLoader
}: Context): MiddlewareItem {
  return forEachRequest((payload, next) => {
    if (payload.method !== (GET_SCHEMA as string)) {
      return next(payload);
    }

    return from(schemaLoader(payload.params[0] as any)).pipe(
      map(result => ({
        id: payload.id,
        jsonrpc: payload.jsonrpc,
        result
      }))
    );
  });
}
