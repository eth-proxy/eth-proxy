import { ActionsObservable, ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import * as actions from './actions';
import { EpicContext } from '../../context';
import { ContractInfo } from '../schema';
import { CallInput, getFunction, sendCall } from '@eth-proxy/rx-web3';

export const processCallEpic = (
  actions$: ActionsObservable<actions.ProcessCall>,
  _,
  { provider, contractLoader }: EpicContext
): Observable<actions.Types> => {
  return actions$.pipe(
    ofType(actions.PROCESS_CALL),
    mergeMap(({ payload }) => {
      return contractLoader(payload.contractName).pipe(
        mergeMap(contract =>
          sendCall(provider, toCallInput(payload, contract)).pipe(
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

function toCallInput(
  { txParams, args, address, method }: actions.CallPayload,
  contract: ContractInfo
): CallInput {
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
