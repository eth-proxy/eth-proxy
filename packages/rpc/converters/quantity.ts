import { BigNumber } from 'bignumber.js';
import { NumberLike } from '../interfaces';

export function toQuantity(value: NumberLike) {
  const nr = new BigNumber(value);
  const result = nr.toString(16);

  return nr.lt(0) ? '-0x' + result.substr(1) : '0x' + result;
}
