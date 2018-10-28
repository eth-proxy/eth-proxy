import { curry } from 'ramda';
import { pickTxParamsProps } from '../request';

export function txParamsValid(params) {
  return !!params.from;
}

export const mergeParams = curry((tx_params: any, defaultTxParams: any) => {
  return pickTxParamsProps({
    ...defaultTxParams,
    ...tx_params
  });
});
