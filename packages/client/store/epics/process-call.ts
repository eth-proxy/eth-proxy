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
import { TxGenerated, ProcessCallFailed, ProcessCallSuccess } from '../actions';
import { getLoadedContractFromRef$ } from '../rx-selectors';

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
  actions$: ActionsObservable<any>,
  _,
  { processCall, contractLoader }: EpicContext
) => {
  return actions$.ofType(PROCESS_CALL).pipe(
    mergeMap(({ payload }: ProcessCall) => {
      return contractLoader(payload.contractName).pipe(
        mergeMap(contract =>
          processCall(prepareRequestArgs(payload, contract)).pipe(
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
