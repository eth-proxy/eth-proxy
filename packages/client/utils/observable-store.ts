import { Store } from 'redux';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Selector } from 'reselect';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';

export type RxSelector<S, R> = (state$: Observable<S>) => Observable<R>;

export interface ObservableStore<T> extends Store<T> {
  select<S>(selector: Selector<T, S>): Observable<S>;
  pipe<S>(rxSelect: RxSelector<T, S>): Observable<S>;
}

export function toObservableStore<S>(redux: Store<S>) {
  const observableStore = redux as ObservableStore<S>;

  const state$ = new BehaviorSubject<S>(redux.getState());

  Object.assign(observableStore, {
    select: <T>(selector?: Selector<S, T>) => {
      return state$.pipe(
        distinctUntilChanged(),
        map(selector),
        distinctUntilChanged()
      );
    },
    pipe: <T>(rxSelect: RxSelector<S, T>) => {
      return state$.pipe(
        distinctUntilChanged(),
        rxSelect,
        distinctUntilChanged()
      );
    }
  });

  observableStore.subscribe(() => {
    state$.next(redux.getState());
  });

  return observableStore;
}
