import { combineReducers, createStore } from 'redux';
import { NormalizedFilter } from './model';
import {
  reject,
  equals,
  Dictionary,
  indexBy,
  curry,
  values,
  flatten
} from 'ramda';
import { toObservableStore } from '../../utils';
import { fillFilterWithMany, isEventMatching } from './utils';
import { BlockchainEvent } from '@eth-proxy/rpc';

export enum Action {
  Load = 'Load',
  LoadSuccess = 'LoadSuccess',
  LoadFailed = 'LoadFailed'
}

type ActionTypes = any;

const idFromNativeEvent = e =>
  e.transactionHash + e.transactionIndex + e.logIndex;

export const eventStateReducer = (
  state: Dictionary<BlockchainEvent> = {},
  action: ActionTypes
) => {
  switch (action.type) {
    case Action.LoadSuccess: {
      return {
        ...state,
        ...indexBy(idFromNativeEvent, action.payload.events)
      };
    }
    default:
      return state;
  }
};

const initialState: Requests = {
  pending: [],
  completed: [],
  failed: []
};

const requestsReducer = (
  state = initialState,
  action: ActionTypes
): Requests => {
  switch (action.type) {
    case Action.Load: {
      return {
        ...state,
        pending: [...state.pending, action.payload.filter]
      };
    }
    case Action.LoadSuccess: {
      return {
        ...state,
        completed: [...state.completed, action.payload.filter],
        pending: reject(equals(action.payload.filter), state.pending)
      };
    }
    case Action.LoadFailed: {
      return {
        ...state,
        failed: [...state.failed, action.payload.filter],
        pending: reject(equals(action.payload.filter), state.pending)
      };
    }
    default:
      return state;
  }
};

export interface Requests {
  pending: NormalizedFilter[];
  completed: NormalizedFilter[];
  failed: NormalizedFilter[];
}

export interface State {
  events: Dictionary<BlockchainEvent>;
  requests: Requests;
}

const reducer = combineReducers({
  requests: requestsReducer,
  events: eventStateReducer
});

export const createEventCache = () => {
  const redux = toObservableStore<State>(createStore(reducer));

  return {
    request: (filter: NormalizedFilter) => {
      redux.dispatch({
        type: Action.Load,
        payload: {
          filter
        }
      });
    },
    result: curry((filter: NormalizedFilter, events: any[]) => {
      redux.dispatch({
        type: Action.LoadSuccess,
        payload: {
          filter,
          events
        }
      });
    }),
    error: curry((filter: NormalizedFilter, error: any) => {
      redux.dispatch({
        type: Action.LoadFailed,
        payload: {
          filter,
          error
        }
      });
    }),
    select: redux.select,
    getState: redux.getState
  };
};

export const getFiltersToLoad = (state: State, next: NormalizedFilter) => {
  return fillFilterWithMany(
    flatten<NormalizedFilter>(values(state.requests)),
    next
  );
};

export const getFiltersLoaded = (state: State, next: NormalizedFilter) => {
  const { completed, failed } = state.requests;
  return fillFilterWithMany([...completed, ...failed], next);
};

export const getEventsForFilter = curry(
  (filter: NormalizedFilter, { events, requests: { failed } }: State) => {
    if (!equals([filter], fillFilterWithMany(failed, filter))) {
      throw Error('Cannot fulfil request, events for filter are missing');
    }
    return values(events).filter(isEventMatching(filter));
  }
);
