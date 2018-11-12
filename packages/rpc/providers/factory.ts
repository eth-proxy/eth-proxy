import { Handler, SubHandler, Payload } from './model';
import { mergeAll } from 'ramda';
import { throwError } from 'rxjs';

export function combineHandlers(
  subHandlers: SubHandler[],
  rest: Handler = throwErrorHandler
): Handler {
  const all = mergeAll<SubHandler>(subHandlers);

  return payload => {
    const handler = all[payload.method] || rest;
    return handler(payload);
  };
}

function throwErrorHandler(payload: Payload) {
  return throwError(Error(`${payload.method} handler not found`));
}
