import { ethHexToBN, createRequest, createMethod } from '../utils';
import { Tag, EthGetBalance } from '../interfaces';

interface GetBalanceRequest {
  account: string;
  atBlock?: Tag;
}

export const toRequest = ({
  account,
  atBlock = 'latest'
}: GetBalanceRequest): EthGetBalance['request'] => {
  return {
    method: 'eth_getBalance',
    params: [account, atBlock]
  };
};

const getBalanceDef = {
  request: toRequest,
  result: ethHexToBN
};

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getbalance
 */
export const getBalanceReq = createRequest(getBalanceDef);

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getbalance
 */
export const getBalance = createMethod(getBalanceDef);
