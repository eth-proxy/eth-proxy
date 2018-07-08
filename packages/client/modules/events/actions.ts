import { NormalizedFilter, ContractQuery, QueryModel } from './model';

export const COMPOSE_QUERY_FROM_MODEL = 'COMPOSE_QUERY_FROM_MODEL';

export interface ComposeQueryFromModel {
  type: typeof COMPOSE_QUERY_FROM_MODEL;
  payload: {
    id: string;
    model: QueryModel;
  };
}

export const createComposeQueryFromModel = (
  payload: ComposeQueryFromModel['payload']
): ComposeQueryFromModel => ({
  type: COMPOSE_QUERY_FROM_MODEL,
  payload
});

export const QUERY_EVENTS = 'QUERY_EVENTS';

export interface QueryEvents {
  type: typeof QUERY_EVENTS;
  payload: {
    id: string;
    queries: ContractQuery[];
    filters: NormalizedFilter[];
  };
}

export const createQueryEvents = (
  payload: QueryEvents['payload']
): QueryEvents => ({
  type: QUERY_EVENTS,
  payload
});

export const QUERY_EVENTS_SUCCESS = 'QUERY_EVENTS_SUCCESS';

export interface QueryEventsSuccess {
  type: typeof QUERY_EVENTS_SUCCESS;
  payload: {
    id: string;
    events: any[];
  };
}

export const createQueryEventsSuccess = (
  payload: QueryEventsSuccess['payload']
): QueryEventsSuccess => ({
  type: QUERY_EVENTS_SUCCESS,
  payload
});

export const QUERY_EVENTS_FAILED = 'QUERY_EVENTS_FAILED';

export interface QueryEventsFailed {
  type: typeof QUERY_EVENTS_FAILED;
  payload: string;
}

export const createQueryEventsFailed = (
  payload: QueryEventsFailed['payload']
): QueryEventsFailed => ({
  type: QUERY_EVENTS_FAILED,
  payload
});

export const EVENTS_LOADED = 'EVENTS_LOADED';

export interface EventsLoaded {
  type: typeof EVENTS_LOADED;
  payload: any[];
}

export const createEventsLoaded = (payload: any[]) => ({
  type: EVENTS_LOADED,
  payload
});

export const ADD_EVENTS_WATCH = 'ADD_EVENTS_WATCH';

export interface AddEventsWatch {
  type: typeof ADD_EVENTS_WATCH;
  payload: {
    id: string;
    fromBlock: number;
    addresses: string[];
  };
}

export const createAddEventsWatch = (
  payload: AddEventsWatch['payload']
): AddEventsWatch => ({
  type: ADD_EVENTS_WATCH,
  payload
});

export const REMOVE_EVENTS_WATCH = 'REMOVE_EVENTS_WATCH';

export interface RemoveEventsWatch {
  type: typeof REMOVE_EVENTS_WATCH;
  payload: string;
}

export const createRemoveEventsWatch = (payload: string) => ({
  type: REMOVE_EVENTS_WATCH,
  payload
});

export type Types =
  | ComposeQueryFromModel
  | QueryEvents
  | QueryEventsSuccess
  | QueryEventsFailed
  | EventsLoaded
  | AddEventsWatch
  | RemoveEventsWatch;
