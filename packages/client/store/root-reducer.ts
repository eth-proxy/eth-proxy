import * as fromAccounts from '../modules/account';
import * as fromBlocks from '../modules/blocks';
import * as fromNetwork from '../modules/network';
import * as fromEvents from '../modules/events';
import * as fromSchema from '../modules/schema';
import * as fromTransactions from '../modules/transaction';
import { combineReducers } from 'redux';

import { State } from './model';

export const reducer = combineReducers<State>({
  [fromNetwork.moduleId]: fromNetwork.reducer,
  [fromSchema.moduleId]: fromSchema.reducer,
  [fromAccounts.moduleId]: fromAccounts.reducer,
  [fromTransactions.moduleId]: fromTransactions.reducer,
  [fromBlocks.moduleId]: fromBlocks.reducer,
  [fromEvents.moduleId]: fromEvents.reducer
} as any);

const initialState = reducer(undefined, { type: '' });

export const ethProxyIntegrationReducer = (
  state: State = initialState as State,
  action: { type: 'SET_ETH-PROXY_STATE'; payload: State }
) => (action.type === 'SET_ETH-PROXY_STATE' ? action.payload : state);
