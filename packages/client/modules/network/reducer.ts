import * as actions from '../../actions';
import { createSelector } from 'reselect';
import { identity } from 'ramda';
import { moduleId } from './constants';
import { NetVersion } from '@eth-proxy/rpc';

export type State = string | null;
export function reducer(
  state: State = null,
  action: actions.Types<NetVersion>
): State {
  if (action.method === 'net_version' && action.type === 'response_success') {
    return action.payload.result;
  }
  return state;
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
