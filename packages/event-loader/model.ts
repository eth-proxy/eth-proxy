import { Observable } from 'rxjs/Observable';
import * as Web3 from 'web3';

export interface ReaderResult {
  work$: Observable<[number, number]>;
  result$: Observable<any[]>;
}

export type Reader = (
  filter: EventFilter,
  work$: Observable<[number, number]>
) => ReaderResult;

export interface EventFilter {
  fromBlock: number;
  toBlock: number;
  address?: string[] | string;
  topics?: string[];
}
