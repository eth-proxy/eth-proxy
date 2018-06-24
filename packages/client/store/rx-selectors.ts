import { Observable } from 'rxjs';
import { State } from './model';
import { map as rxMap, filter, tap, first } from 'rxjs/operators';
import { getContractsFromQueryModel, getDefaultTxParams } from './selectors';
import { keys } from 'ramda';
import { QueryModel } from '../modules/events';
import { ContractInfo } from '../modules/schema';
import * as fromAccounts from '../modules/account';
import * as fromNetwork from '../modules/network';
import * as fromSchema from '../modules/schema';
import * as fromTransactions from '../modules/transaction';

export function getDetectedNetwork$(state$: Observable<State>) {
  return state$.pipe(
    rxMap(fromNetwork.getNetworkId),
    first(x => !!x)
  );
}

export function getContractsFromModel$(queryModel: QueryModel) {
  return (state$: Observable<State>) =>
    state$.pipe(
      first(fromSchema.getHasContracts(keys(queryModel.deps))),
      rxMap(getContractsFromQueryModel(queryModel)),
      tap(contracts => {
        const loadingError = contracts.find((x: any) => x.error);
        if (loadingError) {
          throw loadingError;
        }
      }),
      rxMap(x => x as ContractInfo[])
    );
}

export function getLoadedContractFromRef$(contractRef: string) {
  return (state$: Observable<State>) =>
    state$.pipe(
      rxMap(fromSchema.getContractFromRef(contractRef)),
      first((x: any) => !!x && !x.loading),
      tap(x => {
        if (x.error) {
          throw x.error;
        }
      }),
      rxMap(x => x as ContractInfo)
    );
}

export const getActiveAccount$ = (state$: Observable<State>) =>
  state$.pipe(
    rxMap(fromAccounts.getActiveAccount),
    filter(x => x !== undefined)
  );

export const getTransactionResultFromInitId$ = (id: string) => (
  state$: Observable<State>
) =>
  state$.pipe(
    rxMap(fromTransactions.getTransactionFromInitId(id)),
    tap(x => {
      if (x.status === 'failed') {
        throw x.error;
      }
    })
  );

export function getTxParams(userParams: any) {
  return (state$: Observable<State>) =>
    state$.pipe(
      rxMap(getDefaultTxParams),
      rxMap(fromTransactions.mergeParams(userParams)),
      first(fromTransactions.txParamsValid)
    );
}
