import { TransactionInfo } from '../../model';
import { curry, CurriedFunction2 } from 'ramda';

export interface ProcessTransactionPayload {
  initId: string;
  contractName: string;
  address: string;
  method: string;
  txParams: any;
  args: any;
  abi: any;
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

export const TRANSACTION_FAILED = 'TRANSACTION_FAILED';

export interface TransactionFailed {
  type: 'TRANSACTION_FAILED';
  payload: {
    tx: string;
    error: Error;
  };
}

export const createTransactionFailed = (
  tx: string,
  error
): TransactionFailed => ({
  type: TRANSACTION_FAILED,
  payload: {
    tx,
    error
  }
});

export const TRANSACTION_CONFIRMED = 'TRANSACTION_CONFIRMED';

export interface TransactionConfirmed {
  type: 'TRANSACTION_CONFIRMED';
  payload: {
    receipt;
    logs;
  };
}

export const createTransactionConfirmed = (
  payload: TransactionConfirmed['payload']
): TransactionConfirmed => ({
  type: TRANSACTION_CONFIRMED,
  payload
});

export type TransactionTypes =
  | TxGenerated
  | ProcessTransactionFailed
  | TransactionConfirmed
  | TransactionFailed
  | ProcessTransaction;
