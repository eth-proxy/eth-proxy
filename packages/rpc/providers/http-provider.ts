import { Provider, BaseRpcResponse } from '../interfaces';
import { EMPTY } from 'rxjs';
import { asHandler } from './utils';

const fetch = require('isomorphic-fetch');
const defaultUrl = 'http://localhost:8545';

export function httpProvider(url = defaultUrl): Provider {
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

export const httpHandler = (url = defaultUrl) => asHandler(httpProvider(url));
