import { BlockRange, ContractInfo, QueryArgs } from '../../store';
import { map, reduce, min, chain } from 'ramda';
import { filterOutDone } from './utils/filter-out-done';
import { EventsQueryState } from '../../store/reducers/events';

export interface ExecuteQueryContext {
  contracts: ContractInfo[];
  latestBlockNumber: number;
  queries: EventsQueryState;
}
export const createQueries = ({
  contracts,
  latestBlockNumber,
  queries
}: ExecuteQueryContext) => {
  const addresses = map(c => c.address, contracts);
  const genesis = reduce<number, number>(
    min,
    Infinity,
    map(c => c.genesisBlock, contracts)
  );

  const omittedAlreadyDone = filterOutDone(
    queries,
    addresses.map(address => ({
      address,
      range: [genesis, latestBlockNumber] as BlockRange
    }))
  );

  return chain(address => {
    return omittedAlreadyDone.map(range => ({
      address,
      range
    }));
  }, addresses);
};
