import { ActionsObservable, ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as actions from '../actions';
import { ContractInfo } from '../../schema';
import { EpicContext } from '../../../context';
import { TransactionInput, getFunction, sendTransaction } from '@eth-proxy/rpc';

export const processTransactionEpic = (
  actions$: ActionsObservable<actions.ProcessTransaction>,
  _,
  { provider, contractLoader }: EpicContext
) => {
  return actions$.pipe(
    ofType(actions.PROCESS_TRANSACTION),
    mergeMap(({ payload }) => {
      return contractLoader(payload.contractName).pipe(
        mergeMap(contract =>
          sendTransaction(provider, toTxInput(payload, contract))
        ),
        map(actions.createTxGenerated(payload.initId)),
        catchError(err => {
          return of(
            actions.createProcessTransactionFailed({
              initId: payload.initId,
              err
            })
          );
        })
      );
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
