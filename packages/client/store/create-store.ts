import { createStore, applyMiddleware, Middleware, AnyAction } from 'redux';

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

  redux.subscribe(() => {
    if (externalStore) {
      externalStore.dispatch({
        type: 'SET_ETH-PROXY_STATE',
        payload: redux.getState()
      });
    }
  });

  return redux;
}

export { ObservableStore };
