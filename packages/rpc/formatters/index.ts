import { BigNumber } from 'bignumber.js';
import { Tag, FilterObject, RawFilter, NumberLike } from '../interfaces';
import { contains, evolve, pickBy } from 'ramda';
import { isNotNil } from '../utils';

export function formatQuantity(number: NumberLike) {
  return '0x' + new BigNumber(number).toString(16);
}

const tags: Tag[] = ['earliest', 'latest', 'pending'];
export function isTag(value: string | NumberLike): value is Tag {
  return contains(value, tags);
}

export function formatBlockNr(input: string | NumberLike) {
  return isTag(input) ? input : formatQuantity(input);
}

export function formatFilter(filter: FilterObject): RawFilter {
  return evolve(
    {
      fromBlock: formatBlockNr,
      toBlock: formatBlockNr
    },
    pickBy(isNotNil, filter)
  );
}

export * from './output';
