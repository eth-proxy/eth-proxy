import * as actions from "../actions";
import { createSelector } from "reselect";
import { find } from "ramda";
import {
  TransactionWithHash,
  ConfirmedTransaction,
  FailedTransaction,
  Transaction
} from "../../model";
import * as Web3 from "web3";

export type State = {
  requests: {
    [id: string]: {
      status: string;
      hash: string;
      err?: any;
    };
  };
  data: {
    [hash: string]: any;
  };
};

function hashRequestData(data: any) {
  return new Web3().sha3(JSON.stringify(data));
}

export function reducer(
  state: State = {
    requests: {},
    data: {}
  },
  action: actions.CallTypes
): State {
  switch (action.type) {
    case actions.PROCESS_CALL: {
      const { id, ...data } = action.payload;
      return {
        data: state.data,
        requests: {
          ...state.requests,
          [id]: {
            status: "init",
            hash: hashRequestData(data)
          }
        }
      };
    }

    case actions.PROCESS_CALL_SUCCESS: {
      const { id, data } = action.payload;
      const { hash } = state.requests[id];
      return {
        data: {
          ...state.data,
          [hash]: data
        },
        requests: {
          ...state.requests,
          [id]: {
            status: "success",
            hash
          }
        }
      };
    }

    case actions.PROCESS_CALL_FAILED: {
      const { id, err } = action.payload;
      const { hash } = state.requests[id];
      return {
        data: state.data,
        requests: {
          ...state.requests,
          [id]: {
            status: "failed",
            hash,
            err
          }
        }
      };
    }

    default:
      return state;
  }
}

export const getSelectors = <T>(getModule: (state: T) => State) => {
  const getRequestsById = createSelector(
    getModule,
    m => m.requests
  )
  const getDataByHash = createSelector(
    getModule,
    m => m.data
  )

  const getRequestById = (id: string) => createSelector(
    getRequestsById,
    getDataByHash,
    (requestsById, dataByHash) => {
      const request = requestsById[id];
      const data = dataByHash[request.hash];
      return {
        ...request,
        data
      }
    }
  )

  return {
    getRequestById
  };
};
