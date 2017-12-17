import {
  createSelector,
  defaultMemoize,
  createSelectorCreator
} from 'reselect';
import {
  indexBy,
  reduce,
  values,
  chain,
  map,
  mapObjIndexed,
  filter,
  groupBy,
  pipe,
  pick,
  mergeWith,
  concat,
  evolve,
  equals
} from 'ramda';

import * as actions from '../actions';
import { BlockRange } from '../../model';
import { combineReducers, AnyAction } from 'redux';
import { idFromEvent, sortEvents } from '../../utils';

export interface QueryState {
  loading: boolean;
  range: BlockRange;
  eventIds: string[];
  error?: string;
}

export interface EventsQueryState {
  [address: string]: QueryState[];
}

export function eventsQueryReducer(
  state: EventsQueryState = {},
  action: actions.EventsActionTypes
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
  [hash: string]: any;
}

export function eventEntitiesReducer(
  state: EventsQueryState = {},
  action: actions.EventsActionTypes | actions.TransactionTypes
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
    case actions.TRANSACTION_CONFIRMED: {
      const { logs } = action.payload;

      return {
        ...state,
        ...indexBy(idFromEvent, logs)
      };
    }
    default:
      return state;
  }
}

export interface State {
  entities: EventsByHash;
  queries: EventsQueryState;
}

export const reducer = combineReducers<State>({
  entities: eventEntitiesReducer,
  queries: eventsQueryReducer
});

export const createLengthEqualSelector = createSelectorCreator(
  defaultMemoize,
  (x, y) => x && y && x.length === y.length
);

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  equals
);

export const getSelectors = <T>(getModule: (state: T) => State) => {
  const getEventEntities = createSelector(getModule, m => m.entities);
  const getEventQueries = createSelector(getModule, m => m.queries);
  const getAllEvents = createSelector(getEventEntities, values);
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
    mapObjIndexed<QueryState[], QueryState[]>(qs => filter(x => !!x.error, qs))
  );

  const getQueryResultsByAddress = createSelector(
    getEventsByAddress,
    getFailedQueriedByAddresses,
    (eventsByAddress, failedQueries) => {
      return mapObjIndexed(
        (queries, address) => ({
          failedQueries: queries,
          events: eventsByAddress[address] || []
        }),
        failedQueries
      );
    }
  );

  const getQueryResultFromAddresses = (addresses: string[]) =>
    createSelector(getQueryResultsByAddress, resultsByAddress => {
      return pipe(
        pick(addresses),
        values,
        reduce(mergeWith(concat), {}),
        evolve({ events: sortEvents })
      )(resultsByAddress) as any;
    });

  return {
    getAllEvents,
    getEventEntities,
    getEventQueries,
    getEventsForAddresses,
    getQueryResultFromAddresses
  };
};
