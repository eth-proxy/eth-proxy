import { Observable } from 'rxjs';
import { State } from './model';
import { map as rxMap, tap, first } from 'rxjs/operators';
import { keys } from 'ramda';

import * as fromEvents from '../modules/events';
import * as fromSchema from '../modules/schema';
import * as fromTransactions from '../modules/transaction';

export function getContractsFromModel$(queryModel: fromEvents.QueryModel) {
  return (state$: Observable<State>) =>
    state$.pipe(
      first(fromSchema.getHasContracts(keys(queryModel.deps))),
      rxMap(fromSchema.getContractsFromRefs(keys(queryModel.deps))),
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
