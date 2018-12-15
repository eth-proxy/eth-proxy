import { RpcRequest, LegacyProvider, Provider } from '../interfaces';
import { EMPTY } from 'rxjs';
import { omit } from 'ramda';

type Omit<T, K extends string> = Pick<T, Exclude<keyof T, K>>;

export type Adapted<T extends LegacyProvider> = Omit<T, 'sendAsync'> & Provider;

export const legacyProviderAdapter = <T extends LegacyProvider>(
  legacyProvider: T
): Adapted<T> => {
  const legacy = omit(['sendAsync'], legacyProvider);

  const provider = {
    send: (payload: RpcRequest | RpcRequest[]) => {
      return new Promise((resolve, rej) => {
        legacyProvider.sendAsync(payload, (err, res) => {
          const error = err || (res.error && new Error(res.error.message));

          error ? rej(error) : resolve(res);
        });
      });
    },
    observe: () => EMPTY,
    disconnect: () => {}
  } as Provider;

  return Object.assign({}, legacy, provider);
};
