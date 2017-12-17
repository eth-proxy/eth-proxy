import { ObservableStore, State, getDefaultTxParams } from '../../../store';
import { first, map } from 'rxjs/operators';
import { curry } from 'ramda';
import { pickTxParamsProps } from '../utils';

import { Observable } from 'rxjs/Observable';
import { CurriedFunction2 } from 'ramda';

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
