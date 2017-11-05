import { createStore, Store, applyMiddleware, Middleware } from "redux";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Selector } from "reselect";
import { distinctUntilChanged } from "rxjs/operators/distinctUntilChanged";
import { map } from "rxjs/operators/map";
import { State } from "./model";
import { reducer } from "./root-reducer";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/let';

export type RxSelector<S, R> = (state$: Observable<S>) => Observable<R>;

export interface ObservableStore<T> extends Store<T> {
  select<S>(selector: Selector<T, S>): Observable<S>;
  let<S>(rxSelect: RxSelector<T, S>): Observable<S>;
}

export function createObservableStore(
  middleware: Middleware
): ObservableStore<State> {
  const state$ = new BehaviorSubject<State>(reducer(undefined, { type: 'init' }));
  const select = <S>(selector?: Selector<State, S>) =>
    state$.pipe(distinctUntilChanged(), map(selector), distinctUntilChanged());

  const redux = createStore(
    reducer,
    applyMiddleware(middleware)
  ) as ObservableStore<State>;
  redux.select = select;
  redux.let = state$.let.bind(state$);

  redux.subscribe(() => state$.next(redux.getState()))

  return redux;
}
