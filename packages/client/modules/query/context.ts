import { Observable } from "rxjs/Observable";
import * as Web3 from "web3";
import {
  ObservableStore,
  State,
  getLatestBlockNumber,
  getEventQueries,
  getContractsFromQueryModel,
  whenContractsRegistered$
} from "../../store";
import { first, combineLatest, map, withLatestFrom } from "rxjs/operators";
import { QueryModel, ContractInfo } from "../../model";
import { keys, zipObj, unnest } from "ramda";
import { EventsQueryState } from "../../store/reducers/events";

export interface ExecuteQueryContext {
  contracts: ContractInfo[];
  latestBlockNumber: number;
  queries: EventsQueryState;
}

export const getContext = (
  store: ObservableStore<State>,
  queryModel: QueryModel
): Observable<ExecuteQueryContext> => {
  const contracts$ = store.let(
    whenContractsRegistered$(
      keys(queryModel.deps),
      getContractsFromQueryModel(queryModel)
    )
  );

  return contracts$.pipe(
    combineLatest(
      store.select(getLatestBlockNumber),
    ),
    withLatestFrom(store.select(getEventQueries)),
    map(unnest),
    first(args => args.every(x => !!x)),
    map<any, any>(zipObj(["contracts", "latestBlockNumber", "queries"]))
  );
};
