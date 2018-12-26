import { Provider, RpcRequest } from '../interfaces';
import { reduceRight, curry } from 'ramda';
import { MiddlewareItem, RpcRequestHandler } from './model';
import { from } from 'rxjs';

export const applyMiddleware = curry(
  (interceptors: MiddlewareItem[], provider: Provider): Provider => {
    const engine = createEngine(interceptors, asHandler(provider));

    return {
      ...provider,
      send: (payload: any) => engine(payload).toPromise()
    };
  }
);

function createEngine(
  interceptors: MiddlewareItem[],
  primaryHandler: RpcRequestHandler
) {
  return reduceRight(
    (interceptor, handler) => {
      return (payload: any) => interceptor(payload, handler);
    },
    primaryHandler,
    interceptors
  );
}

export function asHandler(provider: Provider): RpcRequestHandler {
  return (payload: RpcRequest) => from(provider.send(payload));
}
