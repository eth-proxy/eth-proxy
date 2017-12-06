import { Observable } from "rxjs/Observable";
import { State } from "./model";
import { map as rxMap, filter } from "rxjs/operators";
import { first } from "rxjs/operators/first";
import {
  getNetworkId,
  getHasContracts,
  getContractsFromQueryModel,
  getActiveAccount
} from "./selectors";
import { keys } from "ramda";
import { QueryModel } from "../model";
import * as Web3 from "web3";

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

export const getActiveAccount$ = (state$: Observable<State>) =>
  state$.pipe(rxMap(getActiveAccount), filter(x => x !== undefined));
