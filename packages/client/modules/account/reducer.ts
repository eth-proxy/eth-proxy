import * as actions from './actions';
import { createSelector } from 'reselect';
import { moduleId } from './constants';

export type State = {
  activeAccount?: string | null;
};
export function reducer(state: State = {}, action: actions.Types): State {
  switch (action.type) {
    case actions.SET_ACTIVE_ACCOUNT:
      return {
        ...state,
        activeAccount: action.payload || null
      };
    default:
      return state;
  }
}

export const getSelectors = <T>(getModule: (state: T) => State) => {
  return {
    getActiveAccount: createSelector(getModule, m => m.activeAccount)
  };
};

export const { getActiveAccount } = getSelectors(x => x[moduleId]);
