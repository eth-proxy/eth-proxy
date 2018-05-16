import {
  createProxy,
  EthProxyOptions,
  EthProxy,
  ContractsAggregation
} from '@eth-proxy/client';
import { Observable } from 'rxjs/Observable';
import { map, filter } from 'rxjs/operators';
import { race } from 'rxjs/observable/race';
import { of } from 'rxjs/observable/of';
import { fromEvent } from 'rxjs/observable/fromEvent';
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
  ).pipe(filter(x => !!x), map(web3 => web3.currentProvider));

  return createProxy(provider$, options);
}
