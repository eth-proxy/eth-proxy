import { moduleId } from './constants';
import { Data } from '../../interfaces';
import * as actions from '../../actions';
import { LOADING } from '../../constants';
import { dataOf, dataError } from '../../utils';
import { createSelector } from 'reselect';
import { EthProxyCall } from '../../methods/proxy-call';

export interface State {
  [key: string]: Data<any>;
}

interface RequestKeyParams {
  method: string;
  interface: string;
  address?: string;
}

export function toRequestKey({
  address,
  interface: interfaceName,
  method
}: RequestKeyParams) {
  const contract = address ? interfaceName + '@' + address : interfaceName;
  return `${contract}/${method} `;
}

export function reducer(
  state: State = {},
  action: actions.Types<EthProxyCall>
): State {
  if (action.method !== 'eth-proxy_call') {
    return state;
  }

  const { request } = action.payload;
  const requestParams = request[0];

  switch (action.type) {
    case 'request': {
      return {
        ...state,
        [toRequestKey(requestParams)]: LOADING
      };
    }

    case 'response_success': {
      const { result } = action.payload;
      return {
        ...state,
        [toRequestKey(requestParams)]: dataOf(result)
      };
    }

    case 'response_error': {
      const { error } = action.payload;
      return {
        ...state,
        [toRequestKey(requestParams)]: dataError(error)
      };
    }
  }
}

export const getSelectors = <T = { [moduleId]: State }>(
  getModule: (state: T) => State
) => {
  const getCalls = createSelector(
    getModule,
    m => m
  );

  const getCallFrom = (params: RequestKeyParams) => {
    return createSelector(
      getCalls,
      calls => {
        return calls[toRequestKey(params)];
      }
    );
  };

  return {
    getCalls,
    getCallFrom
  };
};
