import { Observable } from 'rxjs';
import { State } from './model';
import { map as rxMap, filter, tap, first } from 'rxjs/operators';
import { keys, map } from 'ramda';

import * as fromEvents from '../modules/events';
import * as fromAccounts from '../modules/account';
import * as fromNetwork from '../modules/network';
import * as fromSchema from '../modules/schema';
import * as fromTransactions from '../modules/transaction';
import { createSelector } from 'reselect';

const getContractsFromQueryModel = (userModel: fromEvents.QueryModel) =>
  createSelector(
    fromSchema.getContractForRef,
    contractsFromRefs => map(contractsFromRefs, keys(userModel.deps))
  );

export function getDetectedNetwork$(state$: Observable<State>) {
  return state$.pipe(
    rxMap(fromNetwork.getNetworkId),
    first(x => !!x)
  ) as Observable<string>;
}

export function getContractsFromModel$(queryModel: fromEvents.QueryModel) {
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
      rxMap(x => x as fromSchema.ContractInfo[])
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
      rxMap(x => x as fromSchema.ContractInfo)
    );
}

export const getActiveAccount$ = (state$: Observable<State>) =>
  state$.pipe(
    rxMap(fromAccounts.getActiveAccount),
    filter(x => x !== undefined)
  ) as Observable<null | string>;

export const getTransactionResultFromInitId$ = (id: string) => (
  state$: Observable<State>
) =>
  state$.pipe(
    rxMap(fromTransactions.getTransactionFromInitId(id)),
    tap(x => {
      if (x && x.status === 'failed') {
        throw x.error;
      }
    })
  );
