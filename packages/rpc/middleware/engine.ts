import { Provider, RpcRequest } from '../interfaces';
import { reduceRight, curry } from 'ramda';
import { MiddlewareItem, RpcRequestHandler } from './model';
import { from } from 'rxjs';

export const applyMiddleware = curry(
  (middlewares: MiddlewareItem[], provider: Provider): Provider => {
    const engine = createEngine(middlewares, asHandler(provider));

    return {
      ...provider,
      send: (payload: any) => engine(payload).toPromise()
    };
  }
);

function createEngine(
  middlewares: MiddlewareItem[],
  primaryHandler: RpcRequestHandler
) {
  return reduceRight(
    (middleware, handler) => {
      return (payload: any) => middleware(payload, handler);
    },
    primaryHandler,
    middlewares
  );
}

export function asHandler(provider: Provider): RpcRequestHandler {
  return (payload: RpcRequest) => from(provider.send(payload));
}
