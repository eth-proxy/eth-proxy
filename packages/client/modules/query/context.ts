import { Observable } from 'rxjs/Observable';
import {
  ObservableStore,
  State,
  getLatestBlockNumberOrFail,
  getEventQueries,
  getContractsFromModel$
} from '../../store';
import { first, combineLatest, map, withLatestFrom } from 'rxjs/operators';
import { QueryModel, ContractInfo } from '../../model';
import { zipObj, unnest, curry, CurriedFunction2 } from 'ramda';
import { EventsQueryState } from '../../store/reducers/events';

export interface ExecuteQueryContext {
  contracts: ContractInfo[];
  latestBlockNumber: number;
  queries: EventsQueryState;
}

export const getContext = curry(
  (
    store: ObservableStore<State>,
    queryModel: QueryModel
  ): Observable<ExecuteQueryContext> => {
    return store
      .let(getContractsFromModel$(queryModel))
      .pipe(
        combineLatest(store.select(getLatestBlockNumberOrFail)),
        withLatestFrom(store.select(getEventQueries)),
        map(unnest),
        first(args => args.every(x => !!x)),
        map<any, any>(zipObj(['contracts', 'latestBlockNumber', 'queries']))
      );
  }
);
