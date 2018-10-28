import { createStore, applyMiddleware, Middleware } from 'redux';

import { State } from './model';
import { reducer } from './root-reducer';
import { ObservableStore, toObservableStore } from '../utils';

export function createAppStore(
  middleware?: Middleware,
  externalStore?: any,
  rootReducer = reducer
): ObservableStore<State> {
  const redux = toObservableStore(
    createStore(
      rootReducer,
      middleware ? applyMiddleware(middleware) : undefined
    )
  );

  if (externalStore) {
    let prevState = redux.getState();
    redux.subscribe(() => {
      const newState = redux.getState();
      if (newState !== prevState) {
        externalStore.dispatch({
          type: 'SET_ETH-PROXY_STATE',
          payload: newState
        });
        prevState = newState;
      }
    });
  }

  return redux;
}

export { ObservableStore };
