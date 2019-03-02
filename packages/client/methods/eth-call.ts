import { Request } from '../modules/request';
import { sendCall, getFunction } from '@eth-proxy/rpc';
import { mergeMap } from 'rxjs/operators';

export type CallHandler<T> = <
  I extends Extract<keyof T, string>,
  M extends Extract<keyof T[I], string>
>(
  request: Request<I, M, T[I][M] extends { in: infer In } ? In : never>
) => Promise<T[I][M] extends { out: infer Out } ? Out : never>;

export function ethCall<
  T,
  I extends Extract<keyof T, string>,
  M extends Extract<keyof T[I], string>
>(
  ethProxy: import('../index').EthProxy<T>,
  request: Request<I, M, T[I][M] extends { in: infer In } ? In : never>
): Promise<T[I][M] extends { out: infer Out } ? Out : never> {
  const {
    address,
    method,
    payload,
    interface: contractName,
    ...params
  } = request;

  return ethProxy
    .loadContractSchema(contractName)
    .pipe(
      mergeMap(({ address: contractAddr, abi }) => {
        return sendCall(ethProxy, {
          abi: getFunction(method, abi),
          args: payload,
          atBlock: 'latest',
          txParams: {
            ...params,
            to: address || contractAddr
          }
        });
      })
    )
    .toPromise();
}
