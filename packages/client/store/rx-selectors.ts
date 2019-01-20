import { Observable } from 'rxjs';
import { State } from './model';
import { map as rxMap, filter, tap, first } from 'rxjs/operators';

import * as fromAccounts from '../modules/account';
import * as fromNetwork from '../modules/network';
import * as fromTransactions from '../modules/transaction';

export function getDetectedNetwork$(state$: Observable<State>) {
  return state$.pipe(
    rxMap(fromNetwork.getNetworkId),
    first(x => !!x)
  ) as Observable<string>;
}

export const getActiveAccount$ = (state$: Observable<State>) =>
  state$.pipe(
    rxMap(fromAccounts.getActiveAccount),
    filter(x => x !== undefined)
  ) as Observable<null | string>;
