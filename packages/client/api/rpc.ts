import { RpcCall, Provider } from '@eth-proxy/rx-web3';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { LiftRpc } from '../interfaces';

export const createRpc = (provider$: Observable<Provider>) => {
  return (<C>(method: RpcCall<C>) =>
    provider$.pipe(mergeMap(method))) as LiftRpc;
};
