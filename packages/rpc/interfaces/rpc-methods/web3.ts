import { BaseRpcRequest, Rpc } from '../rpc';
import { Data } from '../primitives';

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#web3_clientversion
 */
export interface Web3ClientVersionRequest extends BaseRpcRequest {
  method: 'web3_clientVersion';
  params: [];
}
export type Web3ClientVersion = Rpc<Web3ClientVersionRequest, Data>;

export type Web3Method = Web3ClientVersion;
