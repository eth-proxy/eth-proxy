import { Observable } from 'rxjs/Observable';
import { State } from './model';
import { map as rxMap, filter, tap } from 'rxjs/operators';
import { first } from 'rxjs/operators/first';
import {
  getNetworkId,
  getHasContracts,
  getContractsFromQueryModel,
  getActiveAccount,
  getContractFromRef,
  getTransactionFromInitId
} from './selectors';
import { keys } from 'ramda';

import { QueryModel, ContractInfo } from './model';
import * as models from './models';

export function getDetectedNetwork$(state$: Observable<State>) {
  return state$.pipe(rxMap(getNetworkId), first(x => !!x));
}

export function getContractsFromModel$(queryModel: QueryModel) {
  return (state$: Observable<State>) =>
    state$.pipe(
      first(getHasContracts(keys(queryModel.deps))),
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
      rxMap(getContractFromRef(contractRef)),
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
  state$.pipe(rxMap(getActiveAccount), filter(x => x !== undefined));

export const getTransactionResultFromInitId$ = (id: string) => (
  state$: Observable<State>
) =>
  state$.pipe(
    rxMap(getTransactionFromInitId(id)),
    tap(x => {
      if (x.status === 'failed') {
        throw x.error;
      }
    })
  );
