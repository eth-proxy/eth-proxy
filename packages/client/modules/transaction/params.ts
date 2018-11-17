import { curry } from 'ramda';

export function txParamsValid(params) {
  return !!params.from;
}

export const mergeParams = curry((tx_params: any, defaultTxParams: any) => {
  return {
    ...defaultTxParams,
    ...tx_params
  };
});
