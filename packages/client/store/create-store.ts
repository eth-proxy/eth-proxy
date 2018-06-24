import { createStore, Store, applyMiddleware, Middleware } from 'redux';

import { BehaviorSubject, Observable } from 'rxjs';
import { Selector } from 'reselect';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { State } from './model';
import { reducer } from './root-reducer';

export type RxSelector<S, R> = (state$: Observable<S>) => Observable<R>;

export interface ObservableStore<T> extends Store<T> {
  select<S>(selector: Selector<T, S>): Observable<S>;
  pipe<S>(rxSelect: RxSelector<T, S>): Observable<S>;
}

export function createObservableStore(
  middleware?: Middleware,
  externalStore?: any
): ObservableStore<State> {
  const state$ = new BehaviorSubject<State>(
    reducer(undefined, { type: 'init' })
  );
  const select = <S>(selector?: Selector<State, S>) =>
    state$.pipe(
      distinctUntilChanged(),
      map(selector),
      distinctUntilChanged()
    );

  const redux = createStore(
    reducer,
    middleware && applyMiddleware(middleware)
  ) as ObservableStore<State>;
  redux.select = select;
  redux.pipe = <S>(rxSelect: RxSelector<State, S>): Observable<S> =>
    state$.pipe(
      distinctUntilChanged(),
      rxSelect,
      distinctUntilChanged()
    );

  redux.subscribe(() => {
    state$.next(redux.getState());
    if (externalStore) {
      externalStore.dispatch({
        type: 'SET_ETH-PROXY_STATE',
        payload: redux.getState()
      });
    }
  });

  return redux;
}
