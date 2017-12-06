import { map } from "rxjs/operators/map";
import { Observable } from "rxjs/Observable";
import { shareReplay } from "rxjs/operators/shareReplay";
import { take } from "rxjs/operators/take";
import { mergeMap } from "rxjs/operators/mergeMap";
import { createEpicMiddleware } from "redux-observable";

import { createObservableStore } from "./store";
import { createWeb3Instance } from "./utils";
import {
  getNetwork,
  getBalance,
  getLatestBlock,
  getBlock,
  getEvents,
  watchEvents
} from "@eth-proxy/rx-web3";
import {
  createSetNetwork,
  getDetectedNetwork$,
  getContractFromRef,
  getActiveAccount,
  getUniqEvents$
} from "./store";
import { registerContract } from "./modules/register-contract";
import { rootEpic } from "./store/epics";
import {
  EthProxyOptions,
  ContractRef,
  EthProxy
} from "./model";
import { first } from "rxjs/operators";
import { query } from "./modules/query";
import * as Web3 from "web3";
import { identity } from "ramda";
import {
  process,
  createCallAdapter,
  createExecAdapter
} from "./modules/contract";

const defaultOptions = {
  pollInterval: 1000,
  eventReader: getEvents,
  interceptors: {}
};

export function createProxy<T>(
  provider$: Observable<any>,
  userOptions: Partial<EthProxyOptions>
): EthProxy<T> {
  const options = { ...defaultOptions, ...userOptions };
  const replayProvider$ = provider$.pipe(shareReplay(1), take(1));
  const web3Proxy$ = replayProvider$.pipe(map(createWeb3Instance));

  web3Proxy$
    .pipe(mergeMap(getNetwork), map(createSetNetwork))
    .subscribe(action => store.dispatch(action));

  const getEvents = (filter: Web3.FilterObject) =>
    web3Proxy$.let(mergeMap(web3 => options.eventReader(web3, filter)));

  const appWatchEvents = (filter: Web3.FilterObject) =>
    web3Proxy$.let(mergeMap(web3 => watchEvents(web3, filter)));

  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: {
      web3Proxy$,
      options,
      getEvents,
      watchEvents: appWatchEvents
    }
  });

  const store = createObservableStore(epicMiddleware, options.store);

  const interceptors = {
    call: createCallAdapter({
      userInterceptor: (options.interceptors as any).call || identity
    }),
    exec: createExecAdapter({
      store,
      userInterceptor:
        (options.interceptors as any).transaction || identity
    }),
    preQuery: (options.interceptors as any).preQuery || identity,
    postQuery: (options.interceptors as any).postQuery || identity
  };

  return {
    provider$: replayProvider$,
    registerContract: registerContract(store),

    send: process(store, web3Proxy$, interceptors) as any,
    query: query(store, interceptors),

    network$: store.let(getDetectedNetwork$),
    defaultAccount$: store.select(getActiveAccount),

    getBalance: account => web3Proxy$.pipe(mergeMap(getBalance(account))),
    getLatestBlock: () => web3Proxy$.pipe(mergeMap(getLatestBlock)),
    getBlock: arg => web3Proxy$.pipe(mergeMap(getBlock(arg))),
    getContractInfo: (ref: ContractRef) =>
      store.select(getContractFromRef(ref)).pipe(first(x => !!x))
  };
}

export * from "./model";
export * from "./utils";
export { ethProxyIntegrationReducer, State as EthProxyState } from "./store";
