import * as actions from "../actions";
import { createSelector } from "reselect";
import { find, map } from "ramda";
import {
  TransactionWithHash,
  ConfirmedTransaction,
  FailedTransaction,
  Transaction
} from "../../model";

export type State = Transaction[];

export function reducer(
  state: State = [],
  action: actions.TransactionTypes
): State {
  switch (action.type) {
    case actions.TX_GENERATED:
      return [
        ...state,
        {
          ...action.payload,
          status: "pending"
        }
      ];
    case actions.TRANSACTION_CONFIRMED: {
      const { receipt } = action.payload;
      const { transactionHash } = receipt;

      return map(t => {
        if (t.tx !== transactionHash) {
          return t;
        }
        return Object.assign({}, t, { status: "confirmed", receipt });
      }, state);
    }
    case actions.TRANSACTION_FAILED: {
      const { tx } = action.payload;

      return map(t => {
        if (t.tx !== tx) {
          return t;
        }
        return Object.assign({}, t, { status: "failed" });
      }, state);
    }
    default:
      return state;
  }
}

export const getSelectors = <T>(getModule: (state: T) => State) => {
  const getTransactionByTx = (tx: string) =>
    createSelector(getModule, find(t => t.tx === tx));
  return {
    getTransactionByTx
  };
};
