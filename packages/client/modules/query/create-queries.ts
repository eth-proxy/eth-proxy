import { BlockRange } from "../../model";
import { map, reduce, min, chain } from "ramda";
import { ExecuteQueryContext } from "./context";
import { filterOutDone } from "./utils/filter-out-done";

import { QueryArgs } from '../../model';

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
    }, addresses)
};
