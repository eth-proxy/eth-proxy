import { retry } from 'rxjs/operators';
import { MiddlewareItem } from '../model';

export function retryMiddleware(count = 5): MiddlewareItem {
  return (payload, handle) => {
    return handle(payload).pipe(retry(count));
  };
}
