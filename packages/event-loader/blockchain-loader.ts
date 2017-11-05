import { Observable } from "rxjs/Observable";
import { max, reverse, times } from "ramda";
import { catchError, mergeMap, finalize, map } from "rxjs/operators";
import * as Web3 from "web3";
import { Reader, EventFilter } from "./model";
import { Subject } from "rxjs/Subject";
import { getEvents } from "@eth-proxy/rx-web3";
import "rxjs/add/Observable/merge";

const rangeSize = 10000;

export function createBlockchainReader(
  web3: Web3,
  filter: EventFilter
): Reader {
  return (filter: EventFilter, work$: Observable<[number, number]>) => {
    const web3Reader = (f: EventFilter) =>
      getEvents(web3, f as Web3.FilterObject).let(
        map(events => ({
          range: [f.fromBlock, f.toBlock],
          result: events
        }))
      );

    const splitRead = createSplitReader(rangeSize, web3Reader);

    const workLeft$ = new Subject<[number, number]>();
    const result$ = work$.pipe(
      mergeMap(([fromBlock, toBlock]) =>
        splitRead({
          address: filter.address,
          fromBlock,
          toBlock
        }).pipe(
          catchError(() => {
            workLeft$.next([fromBlock, toBlock]);
            return [];
          })
        )
      ),
      finalize(() => workLeft$.complete())
    );
    return {
      result$,
      work$: workLeft$
    };
  };
}

export function createSplitReader(
  rangeSize: number,
  queryRange: (filter: EventFilter) => Observable<any>
) {
  return (filter: EventFilter) => {
    const ranges = calculateRanges(rangeSize, [
      filter.fromBlock,
      filter.toBlock
    ]);

    return Observable.merge(
      ...ranges.map(([fromBlock, toBlock]) =>
        queryRange({
          ...filter,
          fromBlock,
          toBlock
        })
      )
    );
  };
}

export function calculateRanges(
  rangeSize: number,
  [initialNumber, latestNumber]: [number, number]
) {
  const totalBlocks = latestNumber - initialNumber + 1;
  const totalBlocksInRange = rangeSize + 1;
  const blocksCount = Math.ceil(totalBlocks / totalBlocksInRange);
  const ranges = (i: number) => i * rangeSize;

  return reverse(
    times((i: number) => {
      const rangeStart = latestNumber - ranges(i + 1) - i;
      const rangeEnd = latestNumber - ranges(i) - i;

      return [max(initialNumber, rangeStart), rangeEnd] as [number, number];
    }, blocksCount)
  );
}
