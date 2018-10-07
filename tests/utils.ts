import { send } from '@eth-proxy/rx-web3/utils';
import { httpProvider } from '@eth-proxy/rx-web3';

const rpcCall = send(httpProvider());

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

export function mine() {
  return rpcCall({
    method: 'evm_mine',
    params: []
  } as any).toPromise();
}
