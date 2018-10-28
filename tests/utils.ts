import { httpProvider, send } from '@eth-proxy/rpc';

const rpcCall = send(httpProvider());

export function snapshot() {
  return rpcCall({
    method: 'evm_snapshot'
  } as any);
}

export function revert() {
  return rpcCall({
    method: 'evm_snapshot',
    params: []
  } as any);
}

export function mine() {
  return rpcCall({
    method: 'evm_mine',
    params: []
  } as any);
}
