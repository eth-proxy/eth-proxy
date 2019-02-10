import { createSelector } from 'reselect';
import { moduleId } from './constants';
import * as actions from 'client/store/actions';
import { Data } from 'client/interfaces';
import { LOADING, NOT_ASKED } from 'client/constants';
import { dataError, dataOf, isLoaded } from 'client/utils';

export type State = Data<string | null>;

const initial: State = NOT_ASKED;

export function reducer(state = initial, action: actions.Types): State {
  if (action.method !== 'eth_accounts') {
    return state;
  }

  switch (action.type) {
    case 'request':
      return isLoaded(state) ? state : LOADING;
    case 'response_error':
      return dataError(action.payload.error);
    case 'response_success': {
      const next = action.payload.result[0] || null;
      return isLoaded(state) && next === state.value ? state : dataOf(next);
    }
  }
}

export const getSelectors = <T = { [moduleId]: State }>(
  getModule: (state: T) => State
) => {
  return {
    getActiveAccount: createSelector(
      getModule,
      m => m
    )
  };
};
