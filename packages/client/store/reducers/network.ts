import * as actions from "../actions";
import { createSelector } from "reselect";
import { identity } from "ramda";

export type State = string | null;
export function reducer(state: State = null, action: actions.NetworkTypes): State {
  switch (action.type) {
    case actions.SET_NETWORK:
      return action.payload;
    default:
      return state;
  }
}

export const getSelectors = <T>(getModule: (state: T) => State) => {
  return {
    getNetworkId: createSelector(getModule, identity)
  };
};
