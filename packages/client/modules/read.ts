import { ObservableStore, State } from "../store";
import * as Web3 from "web3";
import { Observable } from "rxjs/Observable";
import { QueryResult } from "../model";
import {
  tap,
  ignoreElements,
  merge,
  take,
  concat,
  share
} from "rxjs/operators";
import "rxjs/add/Observable/merge";

export type ReadStrategy = "cache" | "cache-and-network" | "network";

export type ReadSelector<T> = (state: State) => T;

export interface LoaderContext {
  state$: Observable<State>;
  web3: Web3;
}
export interface LoadedData {
  blocks: Web3.Block[];
  logs: QueryResult[];
}

export type Loader = (
  context: LoaderContext
) => Observable<Partial<LoadedData>>;

export interface DataReader<T> {
  selector: ReadSelector<T>;
  loader: Loader;
}

export function read(store: ObservableStore<State>) {
  return (web3: Web3) => <T>(
    readDef: DataReader<T>,
    strategy: ReadStrategy = "cache-and-network"
  ): Observable<T> => {
    const context = { web3, state$: store.select(x => x) };

    const cache$ = store.select(readDef.selector);
    const load$ = readDef
      .loader(context)
      .pipe(
        tap(data => store.dispatch({ type: "Data Loaded", data })),
        ignoreElements(),
        share()
      );

    switch (strategy) {
      case "cache":
        return cache$;
      case "cache-and-network":
        return Observable.merge(load$, cache$) as Observable<T> ;
      case "network":
        return Observable.merge(load$, load$.pipe(take(1), concat(cache$))) as Observable<T> ;
    }
  };
}
