import { BigNumber } from 'bignumber.js';

export function formatQuantity(number: number | string | BigNumber) {
  return '0x' + new BigNumber(number).toString(16);
}
