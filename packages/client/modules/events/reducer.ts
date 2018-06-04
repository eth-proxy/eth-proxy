import { createSelector } from 'reselect';
import { indexBy, values, pickBy } from 'ramda';
import { combineReducers, AnyAction } from 'redux';

import * as actions from './actions';
import {
  DecodedEvent,
  QueryModel,
  ContractQuery,
  NormalizedFilter
} from './model';
import { idFromEvent, sortEvents } from '../../utils';
import { addressMatches, topicsMatches } from './utils';
import { moduleId } from './constants';

import * as fromTransactions from '../transaction';

export interface EventsQueryState {
  [id: string]: {
    queries: ContractQuery[];
    filters: NormalizedFilter[];
    status: 'loading' | 'success' | 'error';
  };
}

export function eventsQueryReducer(
  state: EventsQueryState = {},
  action: actions.EventsActionTypes
): EventsQueryState {
  switch (action.type) {
    case actions.QUERY_EVENTS: {
      const { id, queries, filters } = action.payload;
      return {
        ...state,
        [id]: {
          status: 'loading',
          queries,
          filters
        }
      };
    }
    case actions.QUERY_EVENTS_SUCCESS: {
      const { id } = action.payload;
      return {
        ...state,
        [id]: {
          ...state[id],
          status: 'success'
        }
      };
    }
    case actions.QUERY_EVENTS_FAILED: {
      const id = action.payload;
      return {
        ...state,
        [id]: {
          ...state[id],
          status: 'error'
        }
      };
    }
    default:
      return state;
  }
}

export interface EventsByHash {
  [hash: string]: DecodedEvent;
}

export function eventEntitiesReducer(
  state: EventsByHash = {},
  action: actions.EventsActionTypes | fromTransactions.Types
): EventsByHash {
  switch (action.type) {
    case actions.QUERY_EVENTS_SUCCESS: {
      return {
        ...state,
        ...indexBy(idFromEvent, action.payload.events)
      };
    }
    case actions.EVENTS_LOADED: {
      return {
        ...state,
        ...indexBy(idFromEvent, action.payload)
      };
    }
    case fromTransactions.LOAD_RECEIPT_SUCCESS: {
      const { logs } = action.payload;

      return Object.assign({}, state, indexBy(idFromEvent, logs));
    }
    default:
      return state;
  }
}

export interface ModelsState {
  [id: string]: QueryModel;
}

export function modelsReducer(
  state: ModelsState = {},
  action: actions.EventsActionTypes
): ModelsState {
  switch (action.type) {
    case actions.COMPOSE_QUERY_FROM_MODEL: {
      return {
        ...state,
        [action.payload.id]: action.payload.model
      };
    }
    default:
      return state;
  }
}

export interface State {
  entities: EventsByHash;
  queries: EventsQueryState;
  modelsToCompose: ModelsState;
}

export const reducer = combineReducers<State>({
  entities: eventEntitiesReducer,
  queries: eventsQueryReducer,
  modelsToCompose: modelsReducer
});

export const getSelectors = <T>(getModule: (state: T) => State) => {
  const getEventEntities = createSelector(getModule, m => m.entities);
  const getAllEvents = createSelector(getEventEntities, values);
  const getAllEventsSorted = createSelector(getAllEvents, sortEvents);

  const getEventQueries = createSelector(getModule, m => m.queries);
  const getEventQuery = (id: string) =>
    createSelector(
      getEventQueries,
      q => q[id] || { status: 'loading', filters: [] as NormalizedFilter[] }
    );

  const getQueryResultFromQueryId = (id: string) =>
    createSelector(
      getEventQuery(id),
      getEventEntities,
      ({ status, filters }, eventsById) => {
        return {
          status,
          events: values(
            pickBy(e => filters.some(f => isEventMatching(f, e)), eventsById)
          )
        };
      }
    );

  return {
    getAllEvents: getAllEventsSorted,
    getQueryResultFromQueryId
  };
};

// ignores ranges since its not yet supported
function isEventMatching(f: NormalizedFilter, event: DecodedEvent) {
  return (
    addressMatches(f, event.meta) && topicsMatches(f.topics, event.meta.topics)
  );
}

export const { getAllEvents, getQueryResultFromQueryId } = getSelectors(
  m => m[moduleId]
);
