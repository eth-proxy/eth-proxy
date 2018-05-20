import { createSelector } from 'reselect';
import {
  indexBy,
  reduce,
  values,
  chain,
  map,
  mapObjIndexed,
  filter,
  groupBy,
  any
} from 'ramda';

import * as actions from './actions';
import * as fromTransactions from '../transaction';
import {
  BlockRange,
  DecodedEvent,
  QueryModel,
  AggregatedQueryResult
} from './model';
import { combineReducers, AnyAction } from 'redux';
import {
  idFromEvent,
  sortEvents,
  createLengthEqualSelector,
  createDeepEqualSelector
} from '../../utils';

export interface QueryState {
  loading: boolean;
  range: BlockRange;
  eventIds: string[];
  error?: any;
}

export interface EventsQueryState {
  [address: string]: QueryState[];
}

export function eventsQueryReducer(
  state: EventsQueryState = {},
  action: actions.Types
): EventsQueryState {
  switch (action.type) {
    case actions.QUERY_EVENTS: {
      return reduce(
        (contract, query) => {
          const { address, range } = query;
          return {
            ...contract,
            [address]: [
              ...(contract[address] || []),
              { range, eventIds: [], loading: true }
            ]
          };
        },
        state,
        action.payload
      );
    }
    case actions.QUERY_EVENTS_SUCCESS: {
      return reduce(
        (contract, query) => {
          const { address, range, events } = query;
          return {
            ...contract,
            [address]: (contract[address] || []).map(
              result =>
                rangeEqual(result.range, range)
                  ? {
                      range,
                      eventIds: map(idFromEvent, events),
                      loading: false
                    }
                  : result
            )
          };
        },
        state,
        action.payload
      );
    }
    case actions.QUERY_EVENTS_FAILED: {
      return reduce(
        (contract, query) => {
          const { address, range } = query;
          return {
            ...contract,
            [address]: (contract[address] || []).map(
              result =>
                rangeEqual(result.range, range)
                  ? {
                      range,
                      eventIds: [],
                      loading: false,
                      error: 'Could not load'
                    }
                  : result
            )
          };
        },
        state,
        action.payload
      );
    }
    default:
      return state;
  }
}

function rangeEqual([a1, a2]: BlockRange, [b1, b2]: BlockRange) {
  return a1 === b1 && a2 === b2;
}

export interface EventsByHash {
  [hash: string]: DecodedEvent;
}

export function eventEntitiesReducer(
  state: EventsQueryState = {},
  action: actions.Types | fromTransactions.Types
): EventsQueryState {
  switch (action.type) {
    case actions.QUERY_EVENTS_SUCCESS: {
      return {
        ...state,
        ...indexBy(idFromEvent, chain(x => x.events, action.payload))
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
  action: actions.Types
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
  const getEventQueries = createSelector(getModule, m => m.queries);
  const getAllEvents = createSelector(getEventEntities, values);
  const getAllEventsSorted = createSelector(getAllEvents, sortEvents);

  const getEventsByAddress = createLengthEqualSelector(
    getAllEvents,
    groupBy((x: any) => x.meta.address)
  );
  const getEventsForAddresses = (address: string[]) =>
    createLengthEqualSelector(getAllEvents, events =>
      events.filter(x => address.includes(x.meta.address))
    );

  const getFailedQueriedByAddresses = createDeepEqualSelector(
    getEventQueries,
    mapObjIndexed((qs: QueryState[], address) =>
      filter(x => !!x.error, qs).map(({ range, error }) => ({
        address,
        range,
        error
      }))
    )
  );
  const getIsLoadingByAddresses = createDeepEqualSelector(
    getEventQueries,
    mapObjIndexed<QueryState[], boolean>(qs => any(x => x.loading, qs))
  );

  const getQueryResultsByAddress = createSelector(
    getEventsByAddress,
    getFailedQueriedByAddresses,
    getIsLoadingByAddresses,
    (eventsByAddress, failedQueries, isLoading) => {
      return mapObjIndexed(
        (_, address) =>
          ({
            failedQueries: failedQueries[address],
            loading: isLoading[address],
            events: eventsByAddress[address] || []
          } as AggregatedQueryResult),
        failedQueries
      );
    }
  );

  const getModelsById = createSelector(getModule, m => m.modelsToCompose);
  const getModelFromId = (id: string) =>
    createSelector(getModelsById, byId => byId[id]);

  return {
    getAllEvents,
    getAllEventsSorted,
    getEventEntities,
    getEventQueries,
    getEventsForAddresses,
    getQueryResultsByAddress,
    getModelFromId,
    getIsLoadingByAddresses
  };
};

const emptyResult = {
  failedQueries: [],
  events: [],
  loading: false
} as AggregatedQueryResult;

export const aggregateQueryResults = reduce<
  AggregatedQueryResult,
  AggregatedQueryResult
>((state, result) => {
  return {
    failedQueries: [...state.failedQueries, ...result.failedQueries],
    events: sortEvents([...state.events, ...result.events]),
    loading: state.loading || result.loading
  };
}, emptyResult);
