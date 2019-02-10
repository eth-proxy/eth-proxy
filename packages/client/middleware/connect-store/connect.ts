import { MiddlewareItem, Provider } from '@eth-proxy/rpc';
import { Action } from 'redux';
import {
  toRequest,
  toResponseFailed,
  toResponseSuccess,
  toSubscription
} from './actions';
import { tap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

interface Options {
  dispatch: (action: Action) => void;
  providerRef: () => Provider;
}

export function connectStoreMiddleware(options: Options): MiddlewareItem {
  const { dispatch } = options;
  return (payload, handle) => {
    dispatch(toRequest(payload));

    return handle(payload).pipe(
      tap({
        next: res => dispatch(toResponseSuccess(payload, res)),
        error: err => dispatch(toResponseFailed(payload, err))
      })
    );
  };
}

export function connectSubscriptions(options: Options): MiddlewareItem {
  const { dispatch, providerRef } = options;

  return (payload, handle) => {
    if (payload.method !== 'eth_subscribe') {
      return handle(payload);
    }
    return handle(payload).pipe(
      tap({
        next: ({ result }) => {
          providerRef()
            .observe(result)
            .pipe(catchError(() => EMPTY))
            .subscribe(data =>
              dispatch(toSubscription(payload.params[0], data))
            );
        }
      })
    );
  };
}
