import { curry } from 'ramda';
import { NumberLike } from '../interfaces';
import { BigNumber } from 'bignumber.js';

interface UnitConvert {
  from: number;
  to: number;
}

export const convert = curry(({ from, to }: UnitConvert, value: NumberLike) => {
  const factor = from - to;
  return new BigNumber(value).times(10 ** factor);
});
