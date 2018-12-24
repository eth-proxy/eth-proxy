import { tap } from 'rxjs/operators';
import { MiddlewareItem } from '../model';
import { RpcRequest } from '../../interfaces';
import { always } from 'ramda';

interface Logger {
  log: (message?: any, ...optionalParams: any[]) => void;
  error: (message?: any, ...optionalParams: any[]) => void;
}

interface LoggingOptions {
  logger: Logger;
  pred: (payload: RpcRequest) => boolean;
}

const defaults: LoggingOptions = { logger: console, pred: always(true) };

export function loggingMiddleware(
  options: Partial<LoggingOptions>
): MiddlewareItem {
  const { logger, pred } = { ...defaults, ...options };

  return (payload, handle) => {
    const shouldLog = pred(payload);
    const before = Date.now();
    if (shouldLog) {
      logger.log(`request [${payload.id}] ${payload.method}`, payload);
    }

    return handle(payload).pipe(
      tap({
        next: response => {
          const seconds = (Date.now() - before) / 1000;
          if (shouldLog) {
            logger.log(
              `response [${payload.id}] ${payload.method} (${seconds}s)`,
              response
            );
          }
        },
        error: err => {
          const seconds = (Date.now() - before) / 1000;
          if (shouldLog) {
            logger.error(
              `response [${payload.id}] ${payload.method} (${seconds}s)`,
              err
            );
          }
        }
      })
    );
  };
}
