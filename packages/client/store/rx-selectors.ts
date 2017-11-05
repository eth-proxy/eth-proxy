import { Observable } from "rxjs/Observable";
import { State } from "./model";
import { map as rxMap, filter as rxFilter } from "rxjs/operators";
import { first } from "rxjs/operators/first";
import { getNetworkId, getEventEntities, getHasContracts } from "./selectors";
import { tap, pairwise, startWith, filter } from "rxjs/operators";
import { keys, uniq, without, map, complement, isEmpty } from "ramda";
import { Selector } from "reselect";

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

export function whenContractsRegistered$<T>(
  namesOrAddresses: string[],
  selector: Selector<State, T>
) {
  return (state$: Observable<State>) =>
    state$.pipe(
      first(getHasContracts(namesOrAddresses)),
      rxMap(selector)
    );
}
