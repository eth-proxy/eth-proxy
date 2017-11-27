import * as Web3 from "web3";
import { createProxy, EthProxyOptions, EthProxy } from "@eth-proxy/client";
import { Observable } from "rxjs/Observable";
import { single, map, filter } from "rxjs/operators";
import { race } from "rxjs/observable/race";
import { of } from "rxjs/observable/of";
import { fromEvent } from "rxjs/observable/fromEvent";

export interface EthWindow extends Window {
  web3: {
    currentProvider: Web3.Provider;
  };
}
function getWindow() {
  return window as EthWindow;
}

export function browserProxyFactory(options?: Partial<EthProxyOptions>) {
  const provider$ = race(
    of(getWindow().web3).pipe(filter(x => !!x)),
    fromEvent(getWindow(), "load").pipe(map(() => getWindow().web3))
  ).pipe(filter(x => !!x), map(web3 => web3.currentProvider));

  return createProxy(provider$, options);
}
