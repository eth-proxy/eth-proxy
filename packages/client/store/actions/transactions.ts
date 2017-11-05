export const TX_GENERATED = "TX_GENERATED";

export interface TxGenerated {
  type: "TX_GENERATED";
  payload: {
    address: string;
    from: string;
    method: string;
    tx: string;
  };
}

export const createTxGenerated = (
  payload: TxGenerated["payload"]
): TxGenerated => ({
  type: TX_GENERATED,
  payload
});

export const TRANSACTION_FAILED = "TRANSACTION_FAILED";

export interface TransactionFailed {
  type: "TRANSACTION_FAILED";
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

export const TRANSACTION_CONFIRMED = "TRANSACTION_CONFIRMED";

export interface TransactionConfirmed {
  type: "TRANSACTION_CONFIRMED";
  payload: {
    receipt;
    logs;
  };
}

export const createTransactionConfirmed = (
  payload: TransactionConfirmed["payload"]
): TransactionConfirmed => ({
  type: TRANSACTION_CONFIRMED,
  payload
});

export type TransactionTypes =
  | TxGenerated
  | TransactionConfirmed
  | TransactionFailed;
