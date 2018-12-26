import { curry } from 'ramda';
import { omitCustomProps } from '../request';

export function txParamsValid(params: any) {
  return !!params.from;
}

export const mergeParams = curry((tx_params: any, defaultTxParams: any) => {
  return {
    ...defaultTxParams,
    ...omitCustomProps(tx_params)
  };
});
