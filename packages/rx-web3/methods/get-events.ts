import * as Web3 from 'web3';
import { curry, defaultTo, pipe, values, evolve } from 'ramda';
import { Observable, bindNodeCallback } from 'rxjs';
import { quantityOrTag } from '../formatters';
import { bind } from '../utils';
import { Callback, RawSolidityEvent } from '../interfaces';
import { map } from 'rxjs/operators';

enum BlockRangeTag {
  Earliest = 'earliest',
  Latest = 'latest',
  Pendig = 'pending'
}

const formatBlockNr = quantityOrTag(values(BlockRangeTag));

export const getEvents = curry(
  (
    provider: Web3.Provider,
    options: Web3.FilterObject
  ): Observable<Web3.SolidityEvent<any>[]> => {
    const request = {
      method: 'eth_getLogs',
      params: [
        {
          address: options.address,
          fromBlock: pipe(
            defaultTo(BlockRangeTag.Earliest),
            formatBlockNr
          )(options.fromBlock),
          toBlock: pipe(
            defaultTo(BlockRangeTag.Latest),
            formatBlockNr
          )(options.toBlock),
          topics: options.topics
        }
      ]
    };

    const callback = bind<
      (request: {}, cb: Callback<{ result: RawSolidityEvent[] }>) => void
    >(provider.sendAsync, provider);

    return bindNodeCallback(callback)(request).pipe(
      map(x => x.result.map(fromRawEvent))
    );
  }
);

function fromHex(hex: string) {
  return parseInt(hex, 16);
}

function fromRawEvent(e: RawSolidityEvent) {
  return {
    ...e,
    blockHash: e.blockNumber,
    blockNumber: fromHex(e.blockNumber),
    logIndex: fromHex(e.logIndex),
    transactionIndex: fromHex(e.transactionIndex),

    event: undefined,
    args: {}
  } as Web3.SolidityEvent<any>;
}
