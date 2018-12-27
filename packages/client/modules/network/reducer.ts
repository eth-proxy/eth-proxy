import * as actions from './actions';
import { createSelector } from 'reselect';
import { identity } from 'ramda';
import { moduleId } from './constants';

export type State = string | null;
export function reducer(state: State = null, action: actions.Types): State {
  switch (action.type) {
    case actions.SET_NETWORK:
      return action.payload;
    default:
      return state;
  }
}

export const getSelectors = <T = { [moduleId]: State }>(
  getModule: (state: T) => State
) => {
  return {
    getNetworkId: createSelector(
      getModule,
      identity
    )
  };
};

export const { getNetworkId } = getSelectors(m => m[moduleId]);
