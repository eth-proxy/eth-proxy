import { tap } from 'rxjs/operators';
import { Payload, Handler } from '../../providers';
import { MiddlewareItem } from '../model';

export function loggingMiddleware(logger = console): MiddlewareItem {
  return (payload: Payload, handle: Handler) => {
    logger.log('request', payload);
    return handle(payload).pipe(
      tap({
        next: response => logger.log('response', response)
      })
    );
  };
}
