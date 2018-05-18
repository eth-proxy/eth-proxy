import { curry, CurriedFunction2 } from 'ramda';
import { TransactionInfo, BlockchainEvent } from '../model';
import { TransactionReceipt } from '@eth-proxy/rx-web3';

export interface ProcessTransactionPayload {
  initId: string;
  contractName: string;
  address?: string;
  method: string;
  txParams: any;
  args: any;
}

export const PROCESS_TRANSACTION = 'PROCESS_TRANSACTION';

export interface ProcessTransaction {
  type: 'PROCESS_TRANSACTION';
  payload: ProcessTransactionPayload;
}

export const createProcessTransaction = (
  payload: ProcessTransactionPayload
): ProcessTransaction => ({
  type: PROCESS_TRANSACTION,
  payload
});

export const PROCESS_TRANSACTION_FAILED = 'PROCESS_TRANSACTION_FAILED';

export interface ProcessTransactionFailed {
  type: 'PROCESS_TRANSACTION_FAILED';
  payload: {
    initId: string;
    err: any;
  };
}

export const createProcessTransactionFailed = (
  payload: ProcessTransactionFailed['payload']
): ProcessTransactionFailed => ({
  type: PROCESS_TRANSACTION_FAILED,
  payload
});

export const TX_GENERATED = 'TX_GENERATED';

export interface TxGenerated {
  type: 'TX_GENERATED';
  payload: {
    initId: string;
    tx: string;
  };
}

export const createTxGenerated = curry(
  (initId: string, tx: string): TxGenerated => {
    return {
      type: TX_GENERATED,
      payload: {
        initId,
        tx
      }
    };
  }
);

export const LOAD_RECEIPT_FAILED = 'LOAD_RECEIPT_FAILED';

export interface LoadReceiptFailed {
  type: 'LOAD_RECEIPT_FAILED';
  payload: {
    tx: string;
    error: Error;
  };
}

export const createGetReceiptFailed = (
  tx: string,
  error
): LoadReceiptFailed => ({
  type: LOAD_RECEIPT_FAILED,
  payload: {
    tx,
    error
  }
});

export const LOAD_RECEIPT_SUCCESS = 'LOAD_RECEIPT_SUCCESS';

export interface LoadReceiptSuccess {
  type: 'LOAD_RECEIPT_SUCCESS';
  payload: {
    receipt: TransactionReceipt;
    logs: BlockchainEvent[];
  };
}

export const createLoadReceiptSuccess = (
  payload: LoadReceiptSuccess['payload']
): LoadReceiptSuccess => ({
  type: LOAD_RECEIPT_SUCCESS,
  payload
});

export type TransactionTypes =
  | TxGenerated
  | ProcessTransactionFailed
  | LoadReceiptFailed
  | LoadReceiptSuccess
  | ProcessTransaction;
