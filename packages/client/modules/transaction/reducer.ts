import { createSelector } from 'reselect';
import { find, map, omit, filter } from 'ramda';
import {
  Transaction,
  InitializedTransaction,
  TransactionWithHash
} from './model';
import * as actions from '../../actions';
import { moduleId } from './constants';
import { TransactionStatus } from '@eth-proxy/rpc';
import {
  EthProxyTransaction,
  ETH_PROXY_TRANSACTION
} from '../../methods/proxy-transaction';

export type State = Transaction[];

export function reducer(
  state: State = [],
  action: actions.Types<EthProxyTransaction>
): State {
  if (action.method !== ETH_PROXY_TRANSACTION) {
    return state;
  }
  const { request } = action.payload;
  const requestParams = request[0];

  switch (action.type) {
    case 'request':
      return [
        ...state,
        {
          status: 'init',
          address: requestParams.address!,
          args: requestParams.payload,
          contractName: requestParams.interface,
          id: '0',
          method: requestParams.method,
          txParams: {
            from: requestParams.from,
            to: requestParams.address,
            gas: requestParams.gas,
            value: requestParams.value
          }
        }
      ];

    case 'response_error': {
      return map(t => {
        if (
          t.status !== 'init' ||
          t.method !== requestParams.method ||
          t.contractName !== requestParams.interface
        ) {
          return t;
        }
        return Object.assign({}, t, {
          status: 'failed',
          error: action.payload.error
        });
      }, state);
    }

    case 'response_success':
      return map(t => {
        if (
          t.status !== 'init' ||
          t.method !== requestParams.method ||
          t.contractName !== requestParams.interface
        ) {
          return t;
        }
        return Object.assign({}, t, {
          status: 'tx',
          tx: action.payload.result
        });
      }, state);

    // case actions.LOAD_RECEIPT_SUCCESS: {
    //   const { receipt, logs } = action.payload;
    //   const { transactionHash } = receipt;

    //   return map(t => {
    //     if (t.status === 'init' || t.tx !== transactionHash) {
    //       return t;
    //     }

    //     const isConfirmed = receipt.status === TransactionStatus.Success;

    //     return Object.assign({}, t, {
    //       status: isConfirmed ? 'confirmed' : 'failed',
    //       receipt,
    //       logs
    //     });
    //   }, state);
    // }
    // case actions.LOAD_RECEIPT_FAILED: {
    //   const { tx } = action.payload;

    //   return map(t => {
    //     if (t.status === 'init' || t.tx !== tx) {
    //       return t;
    //     }
    //     return Object.assign({}, t, { status: 'failed' });
    //   }, state);
    // }
    default:
      return state;
  }
}

export const getSelectors = <T = { [moduleId]: State }>(
  getModule: (state: T) => State
) => {
  const getTransactionByTx = (tx: string) =>
    createSelector(
      getModule,
      find(t => t.status !== 'init' && t.tx === tx)
    );

  const getTransactionFromInitId = (initId: string) =>
    createSelector(
      getModule,
      find(t => t.initId === initId)
    );

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
