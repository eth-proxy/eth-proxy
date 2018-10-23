import { Observable, Subject, merge } from 'rxjs';
import { max, reverse, times } from 'ramda';
import { catchError, mergeMap, finalize, map } from 'rxjs/operators';
import { Reader, EventFilter } from './model';
import { getEvents, Provider } from '@eth-proxy/rx-web3';

const rangeSize = 10000;

export function createBlockchainReader(provider: Provider): Reader {
  return (filter: EventFilter, work$: Observable<[number, number]>) => {
    const web3Reader = (f: EventFilter) =>
      getEvents(f, provider).pipe(
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
          ...filter,
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

    return merge(
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
