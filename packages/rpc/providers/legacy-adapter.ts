import { RpcRequest, LegacyProvider, Subprovider, Omit } from '../interfaces';
import { EMPTY } from 'rxjs';
import { omit } from 'ramda';
import { validateResponse } from './utils';

export type Adapted<T extends LegacyProvider> = Omit<T, 'sendAsync'> &
  Subprovider;

const blacklistedMethods: Array<RpcRequest['method']> = [
  'eth_subscribe',
  'eth_unsubscribe'
];

export const legacyProviderAdapter = <T extends LegacyProvider>(
  legacyProvider: T
): Adapted<T> => {
  const legacy = omit(['sendAsync'], legacyProvider);

  const provider = {
    accept: req => !blacklistedMethods.includes(req.method),
    send: (payload: RpcRequest | RpcRequest[]) => {
      return new Promise((resolve, reject) => {
        // TODO: validate array
        legacyProvider.sendAsync(payload, (err: any, res: any) => {
          try {
            if (err) {
              throw Error(err);
            }
            validateResponse(res);
            resolve(res);
          } catch (err) {
            reject(err);
          }
        });
      });
    },
    observe: () => EMPTY,
    disconnect: () => {}
  } as Subprovider;

  return Object.assign({}, legacy, provider);
};
