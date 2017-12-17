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
import * as Web3 from 'web3';
import {
  TransactionWithHash,
  ConfirmedTransaction,
  FailedTransaction,
  QueryModel,
  InterfaceRef,
  InitializedTransaction
} from '../model';

export function getDetectedNetwork$(state$: Observable<State>) {
  return state$.pipe(rxMap(getNetworkId), first(x => !!x));
}

export function getContractsFromModel$(queryModel: QueryModel) {
  return (state$: Observable<State>) =>
    state$.pipe(
      first(getHasContracts(keys(queryModel.deps))),
      rxMap(getContractsFromQueryModel(queryModel))
    );
}

export function getContractFromRef$(contractRef: any) {
  return (state$: Observable<State>) =>
    state$.pipe(rxMap(getContractFromRef(contractRef)), first(x => !!x));
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
