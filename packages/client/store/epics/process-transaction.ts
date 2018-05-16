import {
  createProcessTransactionFailed,
  PROCESS_TRANSACTION,
  ProcessTransaction,
  createTxGenerated,
  CallPayload
} from '../actions';
import { ActionsObservable } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { EpicContext, ProcessRequestArgs, ContractInfo } from '../model';
import { of } from 'rxjs/observable/of';

import { Observable } from 'rxjs/Observable';
import * as actions from '../actions';

function prepareRequestArgs(
  { txParams, args, address, method }: CallPayload,
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
  return actions$.ofType(PROCESS_TRANSACTION).pipe(
    mergeMap(({ payload }: ProcessTransaction) => {
      return contractLoader(payload.contractName).pipe(
        mergeMap(contract =>
          sendTransaction(prepareRequestArgs(payload, contract)).pipe(
            map(createTxGenerated(payload.initId)),
            catchError(err => {
              return of(
                createProcessTransactionFailed({
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
