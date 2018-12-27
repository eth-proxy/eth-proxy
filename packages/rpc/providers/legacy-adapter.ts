import { RpcRequest, LegacyProvider, Subprovider, Omit } from '../interfaces';
import { EMPTY } from 'rxjs';
import { omit } from 'ramda';

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
      return new Promise((resolve, rej) => {
        legacyProvider.sendAsync(payload, (err: any, res: any) => {
          const error = err || (res.error && new Error(res.error.message));

          error ? rej(error) : resolve(res);
        });
      });
    },
    observe: () => EMPTY,
    disconnect: () => {}
  } as Subprovider;

  return Object.assign({}, legacy, provider);
};
