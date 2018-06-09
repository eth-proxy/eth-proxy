import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ActionsObservable } from 'redux-observable';

import * as actions from './actions';
import { EpicContext } from '../../context';
import { createSetNetwork } from './actions';

export const loadNetwork = (
  _: ActionsObservable<any>,
  __,
  { getNetwork }: EpicContext
): Observable<actions.Types> => {
  return getNetwork().pipe(map(createSetNetwork));
};
