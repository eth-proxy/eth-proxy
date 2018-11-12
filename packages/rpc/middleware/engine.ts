import { Provider } from '../interfaces';
import { reduceRight, curry } from 'ramda';
import { MiddlewareItem } from './model';
import { Payload, Handler } from '../providers';

export const applyMiddleware = curry(
  (interceptors: MiddlewareItem[], handler: Handler) => {
    const engine = createEngine(interceptors, handler);

    return {
      sendAsync: (payload: any, cb: any) => {
        engine(payload).subscribe({
          next: results => cb(null, results),
          error: cb
        });
      }
    } as Provider;
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
