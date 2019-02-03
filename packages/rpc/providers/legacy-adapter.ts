import {
  RpcRequest,
  LegacyProvider,
  Subprovider,
  Omit,
  RpcError
} from '../interfaces';
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
          const error = err || (res.error && new JsonRpcError(res.error));

          error ? rej(error) : resolve(res);
        });
      });
    },
    observe: () => EMPTY,
    disconnect: () => {}
  } as Subprovider;

  return Object.assign({}, legacy, provider);
};

export class JsonRpcError extends Error {
  readonly code: number;
  constructor(err: RpcError) {
    super(err.message);
    this.code = err.code;
    Error.captureStackTrace(this, JsonRpcError);
  }
}
