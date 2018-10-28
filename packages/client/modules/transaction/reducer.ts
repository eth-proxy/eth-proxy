import { createSelector } from 'reselect';
import { find, map, omit, filter } from 'ramda';
import {
  Transaction,
  InitializedTransaction,
  TransactionWithHash
} from './model';
import * as actions from './actions';
import { moduleId } from './constants';
import { TransactionStatus } from '@eth-proxy/rpc';

export type State = Transaction[];

export function reducer(state: State = [], action: actions.Types): State {
  switch (action.type) {
    case actions.PROCESS_TRANSACTION:
      return [
        ...state,
        {
          ...omit(['abi'], action.payload),
          status: 'init'
        } as any
      ];

    case actions.PROCESS_TRANSACTION_FAILED: {
      const { initId, err } = action.payload;

      return map(t => {
        if (t.status !== 'init' || t.initId !== initId) {
          return t;
        }
        return Object.assign({}, t, { status: 'failed', error: err });
      }, state);
    }

    case actions.TX_GENERATED:
      return map(t => {
        if (t.status !== 'init' || t.initId !== action.payload.initId) {
          return t;
        }
        return Object.assign({}, t, {
          status: 'tx',
          tx: action.payload.tx
        });
      }, state);

    case actions.LOAD_RECEIPT_SUCCESS: {
      const { receipt, logs } = action.payload;
      const { transactionHash } = receipt;

      return map(t => {
        if (t.status === 'init' || t.tx !== transactionHash) {
          return t;
        }

        const isConfirmed = receipt.status === TransactionStatus.Success;

        return Object.assign({}, t, {
          status: isConfirmed ? 'confirmed' : 'failed',
          receipt,
          logs
        });
      }, state);
    }
    case actions.LOAD_RECEIPT_FAILED: {
      const { tx } = action.payload;

      return map(t => {
        if (t.status === 'init' || t.tx !== tx) {
          return t;
        }
        return Object.assign({}, t, { status: 'failed' });
      }, state);
    }
    default:
      return state;
  }
}

export const getSelectors = <T>(getModule: (state: T) => State) => {
  const getTransactionByTx = (tx: string) =>
    createSelector(getModule, find(t => t.status !== 'init' && t.tx === tx));

  const getTransactionFromInitId = (initId: string) =>
    createSelector(getModule, find(t => t.initId === initId));

  const getPendingTransactions = createSelector(
    getModule,
    m =>
      filter(x => x.status === 'init' || x.status === 'tx', m) as (
        | InitializedTransaction
        | TransactionWithHash)[]
  );

  return {
    getPendingTransactions,
    getTransactionByTx,
    getTransactionFromInitId
  };
};

export const { getTransactionByTx, getTransactionFromInitId } = getSelectors(
  m => m[moduleId]
);
