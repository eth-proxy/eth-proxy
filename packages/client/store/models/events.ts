export interface BlockchainEvent {
  type: string;
  payload?: any;
  meta: EventMetadata;
}

export interface EventMetadata {
  address: string;
  logIndex: number;
  transactionHash: string;
  transactionIndex: number;
  type: string;
  blockHash: string;
  blockNumber: number;
}

export interface QueryModel<T extends {} = {}> {
  name: string;
  deps: {
    [P in keyof Partial<T>]:
      | {
          [eventName: string]:
            | {
                [inputName: string]: any;
              }
            | '*';
        }
      | '*'
  };
}

export type BlockRange = [number, number];

export interface QueryArgs {
  address: string;
  range: BlockRange;
}

export interface QueryResult {
  address: string;
  range: [number, number];
  events: any[];
}

export interface AggregatedQueryResult {
  failedQueries: QueryArgs[];
  loading: boolean;
  events: BlockchainEvent[];
}
