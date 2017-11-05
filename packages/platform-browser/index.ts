import { Observable } from "rxjs/Observable";
import "rxjs/add/Observable/race";
import "rxjs/add/Observable/of";
import "rxjs/add/Observable/fromEvent";
import * as Web3 from "web3";
import { createProxy, EthProxyOptions, EthProxy } from "@eth-proxy/client";
import { single, map, filter } from "rxjs/operators";

export interface EthWindow extends Window {
  web3: {
    currentProvider: Web3.Provider;
  };
}
function getWindow() {
  return window as EthWindow;
}

export function browserProxyFactory(options?: EthProxyOptions) {
  const provider$ = Observable.race(
    Observable.of(getWindow().web3).pipe(filter(x => !!x)),
    Observable.fromEvent(getWindow(), "load").pipe(map(() => getWindow().web3))
  ).pipe(filter(x => !!x), map(web3 => web3.currentProvider));

  return createProxy(provider$, options);
}
