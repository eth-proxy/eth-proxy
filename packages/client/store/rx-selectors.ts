import { Observable } from "rxjs/Observable";
import { State } from "./model";
import { map as rxMap } from "rxjs/operators";
import { first } from "rxjs/operators/first";
import { getNetworkId, getEventEntities, getHasContracts } from "./selectors";
import { pairwise, startWith, filter } from "rxjs/operators";
import { keys, without, map, complement, isEmpty } from "ramda";
import { Selector } from "reselect";
import { sortEvents } from "../utils";

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
    rxMap(sortEvents),
    filter(complement(isEmpty)),
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
