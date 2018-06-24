import { ActionsObservable } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import * as actions from './actions';
import { ProcessRequestArgs } from '../request';
import { EpicContext } from '../../context';
import { ContractInfo } from '../schema';

function prepareRequestArgs(
  { txParams, args, address, method }: actions.CallPayload,
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
): Observable<actions.Types> => {
  return actions$.ofType(actions.PROCESS_CALL).pipe(
    mergeMap(({ payload }) => {
      return contractLoader(payload.contractName).pipe(
        mergeMap(contract =>
          sendCall(prepareRequestArgs(payload, contract)).pipe(
            map(actions.createProcessCallSuccess(payload.id)),
            catchError(err => {
              return of(
                actions.createProcessCallFailed({
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
