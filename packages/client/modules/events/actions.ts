import { NormalizedFilter, ContractQuery, QueryModel } from './model';

export const COMPOSE_QUERY_FROM_MODEL = 'COMPOSE_QUERY_FROM_MODEL';

export interface ComposeQueryFromModel {
  type: typeof COMPOSE_QUERY_FROM_MODEL;
  payload: {
    id: string;
    model: QueryModel;
  };
}

export const composeQueryFromModel = (
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
    live: boolean;
  };
}

export const queryEvents = (payload: QueryEvents['payload']): QueryEvents => ({
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

export const queryEventsSuccess = (
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

export const queryEventsFailed = (
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

export const eventsLoaded = (payload: any[]): EventsLoaded => ({
  type: EVENTS_LOADED,
  payload
});

export const QUERY_UNSUBSCRIBE = 'QUERY_UNSUBSCRIBE';

export interface QueryUnsubscribe {
  type: typeof QUERY_UNSUBSCRIBE;
  payload: string;
}

export const queryUnsubscribe = (payload: string) => ({
  type: QUERY_UNSUBSCRIBE,
  payload
});

export type Types =
  | ComposeQueryFromModel
  | QueryEvents
  | QueryEventsSuccess
  | QueryEventsFailed
  | EventsLoaded
  | QueryUnsubscribe;
