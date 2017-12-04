import { EventsQueryState } from "../../../store/reducers/events";
import { QueryArgs, BlockRange } from "../../../model";
import { chain, uniq, all, propEq } from "ramda";

export const filterOutDone = (state: EventsQueryState, toFilter: QueryArgs[]) => {
  const addresess = toFilter.map(x => x.address);
  const addressRanges = chain(
    address => (state[address] || []).map(x => x.range),
    addresess
  );

  const commonRanges = uniq(addressRanges).filter(range =>
    all(
      address => !!(state[address] || []).find(propEq("range", range)),
      addresess
    )
  );

  return commonRanges.reduce(
    (toQuery, has) => chain(todo => filterNotDone(has, todo), toQuery),
    [toFilter[0].range]
  );
};

export function filterNotDone(
  [hasFrom, hasTo]: BlockRange,
  [wantFrom, wantTo]: BlockRange
): BlockRange[] {
  // No intersection
  if (hasFrom > wantTo || hasTo < wantFrom) {
    return [[wantFrom, wantTo]];
  }
  // Has  --|||||||----
  // Want ----|||------
  if (hasFrom <= wantFrom && hasTo >= wantTo) {
    return [];
  }
  // Has   ----||||---
  // Want  ---|||-----
  if (hasFrom >= wantFrom && hasTo > wantTo) {
    return [[wantFrom, hasFrom]];
  }
  // Has   ----|||-----
  // Want  -----||||---
  if (hasFrom <= wantFrom && hasTo <= wantTo) {
    return [[hasTo, wantTo]];
  }
  // Has  ----|||||||------
  // Want --|||||||||||----
  if (hasFrom > wantFrom && hasTo < wantTo) {
    return [[wantFrom, hasFrom], [hasTo, wantTo]];
  }
  throw Error(
    "Range not found, " + JSON.stringify({ hasFrom, wantFrom, hasTo, wantTo })
  );
}
