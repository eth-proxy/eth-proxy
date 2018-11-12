import { retry } from 'rxjs/operators';
import { Payload, Handler } from '../../providers';
import { MiddlewareItem } from '../model';

export function retryMiddleware(count = 5): MiddlewareItem {
  return (payload: Payload, handle: Handler) => {
    return handle(payload).pipe(retry(count));
  };
}
