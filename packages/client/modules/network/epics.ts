import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActionsObservable } from 'redux-observable';
import { getNetwork } from '@eth-proxy/rx-web3';

import * as actions from './actions';
import { EpicContext } from '../../context';
import { createSetNetwork } from './actions';

export const loadNetwork = (
  _: ActionsObservable<any>,
  __,
  { rpc }: EpicContext
): Observable<actions.Types> => {
  return rpc(getNetwork).pipe(map(createSetNetwork));
};
