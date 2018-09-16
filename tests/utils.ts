import * as Web3 from 'web3';
import { send } from 'rx-web3/utils';

const rpcCall = send(new Web3.providers.HttpProvider());

export function snapshot() {
  return rpcCall({
    method: 'evm_snapshot'
  } as any).toPromise();
}

export function revert() {
  return rpcCall({
    method: 'evm_snapshot',
    params: ['0x01']
  } as any).toPromise();
}
