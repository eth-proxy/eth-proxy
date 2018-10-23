import { curry } from 'ramda';
import { getMethodID, send } from '../../utils';
import { Observable } from 'rxjs';
import { formatQuantity } from '../../formatters';
import {
  Provider,
  RequestInputParams,
  NumberLike,
  FunctionDescription
} from '../../interfaces';
import { map } from 'rxjs/operators';
import { formatRequestInput, encodeArgs } from './formatters';
import { BigNumber } from 'bignumber.js';

export type TransactionInputParams = RequestInputParams & {
  nonce?: NumberLike;
};

export interface TransactionInput<T = any> {
  abi: FunctionDescription;
  args: T;
  txParams: TransactionInputParams;
}

export const sendTransaction = curry(
  (input: TransactionInput, provider: Provider): Observable<string> => {
    validateInput(input);

    return sendTransactionWithData(
      {
        ...input.txParams,
        data: toTxData(input)
      },
      provider
    );
  }
);

function toTxData({ abi, args }: TransactionInput) {
  return getMethodID(abi) + encodeArgs(abi, args);
}

export function sendTransactionWithData<T>(
  payload: TransactionInputParams,
  provider: Provider
) {
  return send(provider)({
    method: 'eth_sendTransaction',
    params: [formatTxPayload(payload)]
  });
}

function formatTxPayload(txParams: TransactionInputParams) {
  return {
    ...formatRequestInput(txParams),
    ...(txParams.nonce && { nonce: formatQuantity(txParams.nonce) })
  };
}

function validateInput(input: TransactionInput) {
  return validateValue(input);
}

function validateValue(input: TransactionInput) {
  const value = new BigNumber(input.txParams.value || 0);
  if (value.gt(0) && !input.abi.payable) {
    throw new Error('Cannot send value to non-payable constructor');
  }
}
