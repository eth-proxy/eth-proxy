import { tap } from 'rxjs/operators';
import { Payload, Handler } from '../../providers';
import { MiddlewareItem } from '../model';

interface Logger {
  log: (message?: any, ...optionalParams: any[]) => void;
  error: (message?: any, ...optionalParams: any[]) => void;
}

export function loggingMiddleware(logger: Logger = console): MiddlewareItem {
  return (payload: Payload, handle: Handler) => {
    logger.log(`[${payload.id}] ${payload.method} request`, payload);

    return handle(payload).pipe(
      tap({
        next: response => {
          logger.log(`[${payload.id}] ${payload.method} response`, response);
        },
        error: err => {
          logger.error(`[${payload.id}] ${payload.method} response`, err);
        }
      })
    );
  };
}
