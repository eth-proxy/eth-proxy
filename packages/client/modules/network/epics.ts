import { Observable, defer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActionsObservable } from 'redux-observable';

import * as actions from './actions';
import { EpicContext } from '../../context';
import { createSetNetwork } from './actions';
import { getNetwork } from '@eth-proxy/rpc';

export const loadNetwork = (
  _: ActionsObservable<any>,
  __,
  { provider }: EpicContext
): Observable<actions.Types> => {
  return defer(() => getNetwork(provider)).pipe(map(createSetNetwork));
};
