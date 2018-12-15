import { Provider, BaseRpcResponse } from '../interfaces';
import { EMPTY } from 'rxjs';
import * as fetch from 'isomorphic-fetch';
import { asHandler } from './utils';

declare const fetch: any;

export function httpProvider(url: string): Provider {
  return {
    send: (payload: any) => {
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            return Promise.reject({ status: response.status, data: response });
          }
          return response.json() as Promise<BaseRpcResponse<any>>;
        })
        .then(response => {
          if ('error' in response) {
            return Promise.reject(response.error);
          }
          return Promise.resolve(response);
        });
    },
    observe: () => EMPTY,
    disconnect: () => {}
  };
}

export const httpHandler = (url: string) => asHandler(httpProvider(url));
