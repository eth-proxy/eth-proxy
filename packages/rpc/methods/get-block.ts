import { createRequest, createMethod } from '../utils';
import { isNil } from 'ramda';
import {
  Tag,
  RawBlock,
  EthGetBlockByHash,
  EthGetBlockByNumber
} from '../interfaces';
import { toBlockNr, fromBlock } from '../converters';

interface GetBlockByNumberArgs {
  number: Tag | number;
  fullTransactions?: boolean;
}

export const getBlockByNumberRequest = ({
  number,
  fullTransactions = false
}: GetBlockByNumberArgs): EthGetBlockByNumber['request'] => {
  return {
    method: 'eth_getBlockByNumber',
    params: [toBlockNr(number), fullTransactions]
  };
};

const getBlockByNumberDef = {
  request: getBlockByNumberRequest,
  result: resultMapper
};

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbynumber
 */
export const getBlockByNumberReq = createRequest(getBlockByNumberDef);

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbynumber
 */
export const getBlockByNumber = createMethod(getBlockByNumberDef);

interface GetBlockByHashArgs {
  hash: string;
  fullTransactions?: boolean;
}

export const getBlockByHashRequest = ({
  hash,
  fullTransactions = false
}: GetBlockByHashArgs): EthGetBlockByHash['request'] => {
  return {
    method: 'eth_getBlockByHash',
    params: [hash, fullTransactions]
  };
};

const getBlockByHashDef = {
  request: getBlockByHashRequest,
  result: resultMapper
};

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbyhash
 */
export const getBlockByHashReq = createRequest(getBlockByHashDef);

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbyhash
 */
export const getBlockByHash = createMethod(getBlockByHashDef);

function resultMapper(result: RawBlock) {
  if (isNil(result)) {
    throw Error('Invalid block');
  }
  return fromBlock(result);
}
