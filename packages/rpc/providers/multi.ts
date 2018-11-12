import { catchError } from 'rxjs/operators';
import { Payload, Handler } from './model';
import { throwError } from 'rxjs';

export function fallbackHandler(fallbacks: Handler[]): Handler {
  return (payload: Payload) => {
    const [next, ...rest] = fallbacks;

    return next(payload).pipe(
      catchError(err => {
        if (!next) {
          return throwError(err);
        }
        return fallbackHandler(rest)(payload);
      })
    );
  };
}
