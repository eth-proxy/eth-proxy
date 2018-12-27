import { FilterObject, RawFilter } from '../interfaces';
import { evolve, pickBy } from 'ramda';
import { isNotNil } from '../utils';
import { toBlockNr } from './block';

export function toFilter(filter: FilterObject): RawFilter {
  return evolve(
    {
      fromBlock: toBlockNr,
      toBlock: toBlockNr
    },
    pickBy(isNotNil, filter)
  );
}
