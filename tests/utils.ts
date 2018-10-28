import { send } from '@eth-proxy/rpc/utils';
import { httpProvider } from '@eth-proxy/rpc';

const rpcCall = send(httpProvider());

export function snapshot() {
  return rpcCall({
    method: 'evm_snapshot'
  } as any).toPromise();
}

export function revert() {
  return rpcCall({
    method: 'evm_snapshot',
    params: []
  } as any).toPromise();
}

export function mine() {
  return rpcCall({
    method: 'evm_mine',
    params: []
  } as any).toPromise();
}
