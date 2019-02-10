import { curry } from 'ramda';
import { omitCustomProps } from '../request';

export const mergeParams = curry((tx_params: any, defaultTxParams: any) => {
  return {
    ...defaultTxParams,
    ...omitCustomProps(tx_params)
  };
});
