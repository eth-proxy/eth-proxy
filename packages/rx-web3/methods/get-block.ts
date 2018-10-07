import { send } from '../utils';
import { curry, isNil } from 'ramda';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Provider, Tag, RpcResponse, RawBlock, Block } from '../interfaces';
import { formatBlockNr } from '../formatters';
import { fromBlock } from '../formatters';

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
  ): Observable<Block> => {
    return send(provider)({
      method: 'eth_getBlockByNumber',
      params: [formatBlockNr(number), fullTransactions]
    }).pipe(resultMapper);
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
  ): Observable<Block> => {
    return send(provider)({
      method: 'eth_getBlockByHash',
      params: [hash, fullTransactions]
    }).pipe(resultMapper);
  }
);

const resultMapper = map<RawBlock, Block>(result => {
  if (isNil(result)) {
    throw Error('Invalid block');
  }
  return fromBlock(result);
});
