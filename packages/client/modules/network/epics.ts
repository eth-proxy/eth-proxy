import { Observable, defer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActionsObservable, StateObservable } from 'redux-observable';

import * as actions from './actions';
import { EpicContext } from '../../context';
import { getNetwork } from '@eth-proxy/rpc';

export const loadNetwork = (
  _: ActionsObservable<any>,
  __: StateObservable<any>,
  { provider }: EpicContext
): Observable<actions.Types> => {
  return defer(() => getNetwork(provider)).pipe(map(actions.createSetNetwork));
};
