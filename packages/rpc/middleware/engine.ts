import { Provider } from '../interfaces';
import { reduceRight, curry } from 'ramda';
import { MiddlewareItem } from './model';
import { Payload, Handler } from '../providers';
import { asHandler } from '../providers';

export const applyMiddleware = curry(
  (interceptors: MiddlewareItem[], provider: Provider): Provider => {
    const engine = createEngine(interceptors, asHandler(provider));

    return {
      ...provider,
      send: (payload: any) => engine(payload).toPromise()
    };
  }
);

function createEngine(interceptors: MiddlewareItem[], handler: Handler) {
  return reduceRight(
    (interceptor, handler) => {
      return (payload: Payload) => interceptor(payload, handler);
    },
    handler,
    interceptors
  );
}
