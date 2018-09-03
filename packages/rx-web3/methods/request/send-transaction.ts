import * as Web3 from 'web3';
import { curry, evolve, pick } from 'ramda';
import {
  getMethodAbi,
  toEncodedSignature,
  encodeArgs,
  bind
} from '../../utils';
import { Observable, bindNodeCallback } from 'rxjs';
import { formatQuantity } from '../../formatters';
import { Provider, TransactionPayload } from '../../interfaces';
import { map } from 'rxjs/operators';

export interface TransactionInput<T = any> {
  abi: Web3.AbiDefinition[];
  address: string;
  method: string;
  args: T;
  txParams: TransactionPayload;
}

export const sendTransaction = curry(
  (provider: Web3.Provider, input: TransactionInput): Observable<string> => {
    return sendTransactionWithPayload(provider, {
      ...input.txParams,
      // Should use only input.txParams.to
      to: input.address || input.txParams.to,
      data: toTxData(input)
    });
  }
);

function toTxData({ abi, args, method }: TransactionInput) {
  const methodAbi = getMethodAbi(abi, method);
  return toEncodedSignature(methodAbi) + encodeArgs(methodAbi, args);
}

export function sendTransactionWithPayload<T>(
  provider: Provider,
  payload: TransactionPayload
) {
  return bindNodeCallback(bind(provider.sendAsync, provider))({
    method: 'eth_sendTransaction',
    params: [formatTxPayload(payload)]
  }).pipe(map((x: any) => x.result)) as Observable<T>;
}

const paramsKeys = ['from', 'to', 'gas', 'gasPrice', 'value', 'data'];
function formatTxPayload(txParams) {
  return evolve(
    {
      gasPrice: formatQuantity,
      gas: formatQuantity,
      value: formatQuantity,
      nonce: formatQuantity
    },
    pick(paramsKeys, txParams)
  );
}
