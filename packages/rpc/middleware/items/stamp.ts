import { map } from 'rxjs/operators';
import { MiddlewareItem } from '../model';
import { createIdGenerator } from '../../utils';

export function stampMiddleware(gen = createIdGenerator()): MiddlewareItem {
  return (payload, handle) => {
    const id = gen();
    const jsonrpc = '2.0' as '2.0';

    return handle({
      id,
      jsonrpc,
      ...payload
    }).pipe(
      map(result => ({
        id,
        jsonrpc,
        ...result
      }))
    );
  };
}
