import { Provider } from '../interfaces';
import { reduceRight, curry } from 'ramda';
import { MiddlewareItem, RpcRequestHandler } from './model';
import { from } from 'rxjs';

export const applyMiddleware = curry(
  (middlewares: MiddlewareItem[], provider: Provider): Provider => {
    const engine = createEngine(middlewares, asHandler(provider));

    return {
      ...provider,
      send: payload => engine(payload).toPromise()
    };
  }
);

function createEngine(
  interceptors: MiddlewareItem[],
  primaryHandler: RpcRequestHandler
): RpcRequestHandler {
  return reduceRight(
    (interceptor, handler) => {
      return (payload: any) => interceptor(payload, handler);
    },
    primaryHandler,
    interceptors
  );
}

export function asHandler(provider: Provider): RpcRequestHandler {
  return payload => from(provider.send(payload));
}
