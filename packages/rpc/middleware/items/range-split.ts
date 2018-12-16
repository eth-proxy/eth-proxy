import { Tag, EthGetLogsRequest, EthGetLogs } from '../../interfaces';
import { of } from 'rxjs';
import { reverse, times, max, pipe, assocPath, evolve, concat } from 'ramda';
import { ethHexToNumber } from '../../utils';
import { isTag, formatBlockNr } from '../../formatters';
import { mergeMap, reduce } from 'rxjs/operators';
import { MiddlewareItem } from '../model';

export function rangeSplitMiddleware(
  rangeSize: number = 10000
): MiddlewareItem {
  return (payload, handle) => {
    if (payload.method !== 'eth_getLogs') {
      return handle(payload);
    }
    const { fromBlock, toBlock } = payload.params[0];

    if (!isNumberBlock(fromBlock) || !isNumberBlock(toBlock)) {
      return handle(payload);
    }

    const ranges = calculateRanges(rangeSize, [
      ethHexToNumber(fromBlock),
      ethHexToNumber(toBlock)
    ]);

    return of(
      ...ranges.map(([newFrom, newTo]) => {
        return pipe(
          assocPath(['params', 0, 'fromBlock'], formatBlockNr(newFrom)),
          assocPath(['params', 0, 'toBlock'], formatBlockNr(newTo))
        )(payload) as EthGetLogsRequest;
      })
    ).pipe(
      mergeMap(handle),
      reduce(
        (curr, next: EthGetLogs['response']) => {
          return evolve(
            {
              result: concat(next.result)
            },
            curr
          );
        },
        { result: [] } as EthGetLogs['response']
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
    times(i => {
      const rangeStart = latestNumber - ranges(i + 1) - i;
      const rangeEnd = latestNumber - ranges(i) - i;

      return [max(initialNumber, rangeStart), rangeEnd];
    }, blocksCount)
  );
}

function isNumberBlock(block: Tag | string | undefined) {
  return block && !isTag(block);
}
