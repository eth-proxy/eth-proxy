import { ActionsObservable, StateObservable } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as actions from '../actions';
import { EpicContext } from 'client/context';
import { TransactionInput, getFunction, sendTransaction } from '@eth-proxy/rpc';
import { ofType } from 'client/utils';
import { getSchema, ContractInfo } from 'client/methods';

export const processTransactionEpic = (
  actions$: ActionsObservable<actions.ProcessTransaction>,
  _: StateObservable<any>,
  { provider }: EpicContext
) => {
  return actions$.pipe(
    ofType(actions.PROCESS_TRANSACTION),
    mergeMap(({ payload }) => {
      return getSchema(provider, payload.contractName)
        .then(contract =>
          sendTransaction(provider, toTxInput(payload, contract))
        )
        .then(actions.createTxGenerated(payload.initId))
        .catch(err => {
          return of(
            actions.createProcessTransactionFailed({
              initId: payload.initId,
              err
            })
          );
        });
    })
  );
};

function toTxInput(
  { txParams, args, address, method }: actions.ProcessTransaction['payload'],
  contract: ContractInfo
): TransactionInput {
  const to = address || contract.address;
  return {
    abi: getFunction(method, contract.abi),
    args,
    txParams: {
      ...(txParams || {}),
      to
    }
  };
}
