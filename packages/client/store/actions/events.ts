import { QueryArgs, QueryResult } from "../../model";

export const QUERY_EVENTS = "QUERY_EVENTS";

export interface QueryEvents {
  type: "QUERY_EVENTS";
  payload: QueryArgs[];
}

export const createQueryEvents = (payload: QueryArgs[]) => ({
  type: QUERY_EVENTS,
  payload
});

export const QUERY_EVENTS_SUCCESS = "QUERY_EVENTS_SUCCESS";

export interface QueryEventsSuccess {
  type: "QUERY_EVENTS_SUCCESS";
  payload: QueryResult[];
}

export const createQueryEventsSuccess = (payload: QueryResult[]) => ({
  type: QUERY_EVENTS_SUCCESS,
  payload
});

export const QUERY_EVENTS_FAILED = "QUERY_EVENTS_FAILED";

export interface QueryEventsFailed {
  type: "QUERY_EVENTS_FAILED";
  payload: QueryArgs[];
}

export const createQueryEventsFailed = (payload: QueryArgs[]) => ({
  type: QUERY_EVENTS_FAILED,
  payload
});

export type EventsActionTypes =
  | QueryEvents
  | QueryEventsSuccess
  | QueryEventsFailed;
