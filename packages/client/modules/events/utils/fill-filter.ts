import { NormalizedFilter } from '../model';
import { equals, reduce, chain } from 'ramda';
import { areTopicsSubset } from './are-topics-subset';
import { diffRanges } from './diff-ranges';

export function fillFilter(filler: NormalizedFilter, toFill: NormalizedFilter) {
  if (equals(filler, toFill)) {
    return [];
  }

  if (
    filler.address === toFill.address &&
    areTopicsSubset(filler.topics, toFill.topics)
  ) {
    return diffRanges(
      [filler.fromBlock, filler.toBlock],
      [toFill.fromBlock, toFill.toBlock]
    ).map(([fromBlock, toBlock]) => ({
      ...toFill,
      fromBlock,
      toBlock
    }));
  }

  return [toFill];
}

export const fillFilterWithMany = (
  currents: NormalizedFilter[],
  next: NormalizedFilter
) => {
  return reduce(
    (toFill, filler) => chain(f => fillFilter(filler, f), toFill),
    [next],
    currents
  );
};
