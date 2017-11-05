import { Observable } from "rxjs/Observable";
import { State } from "./model";
import { map as rxMap } from "rxjs/operators/map";
import { first } from "rxjs/operators/first";
import { getNetworkId, getEventEntities } from "./selectors";
import { tap, pairwise, startWith, filter } from "rxjs/operators";
import { keys, uniq, without, map, complement, isEmpty } from "ramda";

export function getDetectedNetwork$(state$: Observable<State>) {
  return state$.pipe(rxMap(getNetworkId), first(x => !!x));
}

export function getUniqEvents$(state$: Observable<State>) {
  return state$.pipe(
    rxMap(getEventEntities),
    startWith({}),
    pairwise(),
    rxMap(([prev, curr]) => {
      const added = without(keys(prev), keys(curr));
      return map(key => curr[key], added);
    }),
    filter(complement(isEmpty))
  );
}
