import * as Web3 from "web3";
import { createBlockchainReader } from "./blockchain-loader";
import { EventFilter } from "./model";
import { bufferResult } from "./results-buffer";
import { pipe } from "ramda";
import { Observable } from "rxjs/Observable";

export function defaultReader(web3: Web3, filter: EventFilter) {
  const bcReader = createBlockchainReader(web3, filter);
  
  return pipe(bcReader, bufferResult)(
    filter,
    Observable.of([filter.fromBlock, filter.toBlock] as [number, number])
  );
}

export * from "./blockchain-loader";
export * from "./model";
