import { Dictionary } from 'ramda';

export interface QueryModel<T extends {} = {}> {
  name: string;
  deps: {
    [P in keyof Partial<T>]:
      | '*'
      | {
          [eventName: string]:
            | '*'
            | {
                [inputName: string]: any;
              };
        }
  };
  addresses?: Dictionary<string | string[]>;
  fromBlock?: number;
}

export interface QueryResult {
  address: string;
  range: [number, number];
  events: any[];
}

export interface NormalizedFilter {
  fromBlock: number;
  toBlock: number;
  address: string | string[];
  topics: string[][];
}

export interface Topics {
  eventTopic: string[];
  t1: string[];
  t2: string[];
  t3: string[];
}

export type BlockRange = [number, number];

export interface ContractQuery {
  address: string[];
  topics: Topics[];
  range: BlockRange;
}
