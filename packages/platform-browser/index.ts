import {
  createProxy,
  EthProxyOptions,
  EthProxy,
  ContractsAggregation
} from '@eth-proxy/client';
import { Observable, race, of, fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Provider } from '@eth-proxy/rx-web3';

export interface EthWindow extends Window {
  web3: {
    currentProvider: Provider;
  };
}
function getWindow() {
  return window as EthWindow;
}

export function browserProxyFactory(options?: EthProxyOptions) {
  const provider$ = race(
    of(getWindow().web3).pipe(filter(x => !!x)),
    fromEvent(getWindow(), 'load').pipe(map(() => getWindow().web3))
  ).pipe(
    filter(x => !!x),
    map(web3 => web3.currentProvider)
  );

  return createProxy(provider$, options);
}
