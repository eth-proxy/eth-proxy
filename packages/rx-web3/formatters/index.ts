import { BigNumber } from 'bignumber.js';
import { Tag, NumberLike } from '../interfaces';
import { contains } from 'ramda';

export function formatQuantity(number: NumberLike) {
  return '0x' + new BigNumber(number).toString(16);
}

const tags: Tag[] = ['earliest', 'latest', 'pending'];
function isTag(value: string | NumberLike): value is Tag {
  return contains(value, tags);
}

export function formatBlockNr(input: string | NumberLike) {
  return isTag(input) ? input : formatQuantity(input);
}

export * from './output';
