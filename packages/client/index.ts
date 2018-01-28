import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { shareReplay } from 'rxjs/operators/shareReplay';
import { take } from 'rxjs/operators/take';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { createEpicMiddleware } from 'redux-observable';
import {
  getNetwork,
  getBalance,
  getLatestBlock,
  getBlock,
  getEvents,
  watchEvents
} from '@eth-proxy/rx-web3';
import * as Web3 from 'web3';
import { identity } from 'ramda';

import {
  processTransaction,
  createWeb3RequestProcessor,
  processCall
} from './modules/contract';
import {
  createObservableStore,
  getActiveAccount$,
  ProcessRequestArgs,
  State,
  Request
} from './store';
import { createWeb3Instance } from './utils';
import {
  createSetNetwork,
  getDetectedNetwork$,
  EthProxyOptions
} from './store';
import { rootEpic } from './store/epics';
import { EthProxy } from './model';
import { query } from './modules/query';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { createSchemaLoader } from './modules/schema';

const defaultOptions = {
  pollInterval: 1000,
  eventReader: getEvents,
  interceptors: {},
  store: undefined
};

let globalId = 0;
const genId = () => (globalId++).toString();

export function createProxy<T extends {}>(
  provider$: Observable<any>,
  userOptions: EthProxyOptions
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

  const web3RequestProcessor = (args: ProcessRequestArgs) =>
    web3Proxy$.pipe(
      map(createWeb3RequestProcessor),
      mergeMap(processor => processor(args))
    );
  const contractLoader = (name: string) => createSchemaLoader(store)(name);

  const state$ = new BehaviorSubject<State>(null);

  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: {
      web3Proxy$,
      options,
      getEvents,
      watchEvents: appWatchEvents,
      processTransaction: web3RequestProcessor,
      processCall: web3RequestProcessor,
      state$,
      contractSchemaResolver: options.contractSchemaResolver,
      contractLoader
    }
  });

  var store = createObservableStore(epicMiddleware, options.store);
  store.select(x => x).subscribe(state$);

  const getInterceptor = (key: string) =>
    (options.interceptors as any)[key] || identity;
  const interceptors = {
    transaction: getInterceptor('transaction'),
    ethCall: getInterceptor('ethCall'),
    preQuery: getInterceptor('preQuery'),
    postQuery: getInterceptor('postQuery')
  };

  return {
    provider$: replayProvider$,
    query: query(store, genId, interceptors),

    network$: store.let(getDetectedNetwork$),
    defaultAccount$: store.let(getActiveAccount$),

    getBalance: account => web3Proxy$.pipe(mergeMap(getBalance(account))),
    getLatestBlock: () => web3Proxy$.pipe(mergeMap(getLatestBlock)),
    getBlock: arg => web3Proxy$.pipe(mergeMap(getBlock(arg))),

    loadContractSchema: contractLoader,

    transaction: (request: Request<string, string, any>) =>
      processTransaction(store, genId)(request).let(interceptors.transaction),

    ethCall: (request: Request<string, string, any>) =>
      processCall(store, genId)(request).let(interceptors.ethCall)
  };
}

export * from './model';
export * from './utils';
export { ethProxyIntegrationReducer, State as EthProxyState } from './store';
export * from './modules/contract';
export * from './modules/entity';

export function entity(arg) {
  return arg;
}
