import { first, map } from 'rxjs/operators';
import { curry } from 'ramda';

import { Observable } from 'rxjs/Observable';
import { CurriedFunction2 } from 'ramda';
import { getDefaultTxParams, ObservableStore, State } from '../../store';
import { pickTxParamsProps } from '../request';

export function prepareTxParams(store: ObservableStore<State>) {
  return userParams =>
    store
      .select(getDefaultTxParams)
      .pipe(map(mergeParams(userParams)), first(txParamsValid));
}

function txParamsValid(params) {
  return !!params.from;
}

export const mergeParams = curry((tx_params: any, defaultTxParams: any) => {
  return pickTxParamsProps({
    ...defaultTxParams,
    ...tx_params
  });
});
