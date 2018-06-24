import * as Web3 from 'web3';
import { clone, curry, CurriedFunction2 } from 'ramda';
import { createWeb3, getMethodAbi } from '../../utils';
import { Observable, bindNodeCallback } from 'rxjs';
import { formatPayload } from './formatters';

export interface TransactionInput {
  abi: Web3.AbiDefinition[];
  address: string;
  method: string;
  args: any;
  txParams;
}

export const sendTransaction = curry(
  (
    provider: Web3.Provider,
    { abi, address, method, args, txParams }: TransactionInput
  ): Observable<string> => {
    const { sendTransaction } = createWeb3(provider)
      .eth.contract(abi)
      .at(address)[method];

    const methodAbi = getMethodAbi(abi, method);
    const web3Args = formatPayload(args, methodAbi);

    return (bindNodeCallback as any)(sendTransaction)(
      ...clone(web3Args),
      clone(txParams)
    );
  }
);
