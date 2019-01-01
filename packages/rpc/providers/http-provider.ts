/// <reference lib="dom" />
import { Subprovider, RpcRequest, RpcResponses } from '../interfaces';
import { EMPTY } from 'rxjs';
import { validateResponse } from './utils';

const fetch = require('isomorphic-fetch') as GlobalFetch['fetch'];
const defaultUrl = 'http://localhost:8545';

interface HttpProviderConfig {
  url?: string;
  accept?: Subprovider['accept'];
}

const blacklistedMethods: Array<RpcRequest['method']> = [
  'eth_subscribe',
  'eth_unsubscribe'
];

export function httpSubprovider({
  url = defaultUrl,
  accept = req => !blacklistedMethods.includes(req.method)
}: HttpProviderConfig = {}): Subprovider {
  return {
    accept,
    send: payload => {
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
          return response.json() as Promise<RpcResponses<any>>;
        })
        .then(x => {
          validateResponse(x);
          return x;
        });
    },
    observe: () => EMPTY,
    disconnect: () => {}
  };
}
