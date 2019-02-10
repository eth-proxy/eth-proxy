import * as actions from 'client/store/actions';
import { createSelector } from 'reselect';
import { moduleId } from './constants';
import { Data } from 'client/interfaces';
import { NOT_ASKED, LOADING } from 'client/constants';
import { isLoaded, dataError, dataOf } from 'client/utils';

export type State = Data<string>;
export function reducer(
  state: State = NOT_ASKED,
  action: actions.Types
): State {
  if (action.method !== 'net_version') {
    return state;
  }

  switch (action.type) {
    case 'request':
      return isLoaded(state) ? state : LOADING;
    case 'response_error':
      return dataError(action.payload.error);
    case 'response_success': {
      const networkId = action.payload.result;
      return isLoaded(state) && networkId === state.value
        ? state
        : dataOf(networkId);
    }
  }
}

export const getSelectors = <T = { [moduleId]: State }>(
  getModule: (state: T) => State
) => {
  return {
    getNetworkId: createSelector(
      getModule,
      m => m
    )
  };
};
