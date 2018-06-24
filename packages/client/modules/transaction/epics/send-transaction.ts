import { ActionsObservable } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import * as actions from '../actions';
import { ContractInfo } from '../../schema';
import { EpicContext } from '../../../context';
import { ProcessRequestArgs } from '../../request';

function prepareRequestArgs(
  { txParams, args, address, method }: actions.ProcessTransaction['payload'],
  contract: ContractInfo
): ProcessRequestArgs {
  return {
    abi: contract.abi,
    address: address || contract.address,
    args,
    method,
    txParams
  };
}

export const processTransactionEpic = (
  actions$: ActionsObservable<actions.ProcessTransaction>,
  _,
  { sendTransaction, contractLoader }: EpicContext
) => {
  return actions$.ofType(actions.PROCESS_TRANSACTION).pipe(
    mergeMap(({ payload }) => {
      return contractLoader(payload.contractName).pipe(
        mergeMap(contract =>
          sendTransaction(prepareRequestArgs(payload, contract)).pipe(
            map(actions.createTxGenerated(payload.initId)),
            catchError(err => {
              return of(
                actions.createProcessTransactionFailed({
                  initId: payload.initId,
                  err
                })
              );
            })
          )
        )
      );
    })
  );
};
