import { curry } from 'ramda';
import { getMethodID, send } from '../../utils';
import { formatQuantity } from '../../formatters';
import {
  Provider,
  RequestInputParams,
  NumberLike,
  FunctionDescription
} from '../../interfaces';
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

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction
 */
export const sendTransaction = curry(
  (provider: Provider, input: TransactionInput) => {
    validateInput(input);

    return sendTransactionWithData(provider, {
      ...input.txParams,
      data: toTxData(input)
    });
  }
);

function toTxData({ abi, args }: TransactionInput) {
  return getMethodID(abi) + encodeArgs(abi, args);
}

export const sendTransactionWithData = curry(
  (provider: Provider, payload: TransactionInputParams) => {
    return send(provider)({
      method: 'eth_sendTransaction',
      params: [formatTxPayload(payload)]
    });
  }
);

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
