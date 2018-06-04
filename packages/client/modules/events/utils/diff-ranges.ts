export function diffRanges(
  [hasFrom, hasTo]: [number, number],
  [wantFrom, wantTo]: [number, number]
): [number, number][] {
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
    'Range not found, ' + JSON.stringify({ hasFrom, wantFrom, hasTo, wantTo })
  );
}
