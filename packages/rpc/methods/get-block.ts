import { send } from '../utils';
import { curry, isNil } from 'ramda';
import { Provider, Tag, RawBlock } from '../interfaces';
import { toBlockNr, fromBlock } from '../converters';

interface GetBlockByNumberArgs {
  number: Tag | number;
  fullTransactions?: boolean;
}
/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbynumber
 */
export const getBlockByNumber = curry(
  (
    provider: Provider,
    { number, fullTransactions = false }: GetBlockByNumberArgs
  ) => {
    return send(provider)({
      method: 'eth_getBlockByNumber',
      params: [toBlockNr(number), fullTransactions]
    }).then(resultMapper);
  }
);

interface GetBlockByHashArgs {
  hash: string;
  fullTransactions?: boolean;
}

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbyhash
 */
export const getBlockByHash = curry(
  (
    provider: Provider,
    { hash, fullTransactions = false }: GetBlockByHashArgs
  ) => {
    return send(provider)({
      method: 'eth_getBlockByHash',
      params: [hash, fullTransactions]
    }).then(resultMapper);
  }
);

const resultMapper = (result: RawBlock) => {
  if (isNil(result)) {
    throw Error('Invalid block');
  }
  return fromBlock(result);
};
