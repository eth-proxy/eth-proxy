import {
  PROCESS_CALL,
  ProcessCall,
  createProcessCallSuccess,
  createProcessCallFailed,
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

export const processCallEpic = (
  actions$: ActionsObservable<actions.ProcessCall>,
  _,
  { sendCall, contractLoader }: EpicContext
) => {
  return actions$.ofType(PROCESS_CALL).pipe(
    mergeMap(({ payload }: ProcessCall) => {
      return contractLoader(payload.contractName).pipe(
        mergeMap(contract =>
          sendCall(prepareRequestArgs(payload, contract)).pipe(
            map(createProcessCallSuccess(payload.id)),
            catchError(err => {
              return of(
                createProcessCallFailed({
                  id: payload.id,
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
