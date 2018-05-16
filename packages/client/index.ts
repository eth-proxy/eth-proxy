import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { shareReplay } from 'rxjs/operators/shareReplay';
import { take } from 'rxjs/operators/take';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { createEpicMiddleware } from 'redux-observable';
import {
  getEvents,
  createRxWeb3,
  FilterObject,
  Provider
} from '@eth-proxy/rx-web3';
import { identity } from 'ramda';

import { processTransaction, processCall } from './modules/contract';
import {
  createObservableStore,
  getActiveAccount$,
  State,
  Request
} from './store';
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
  provider$: Observable<Provider>,
  userOptions: EthProxyOptions
): EthProxy<T> {
  const options = { ...defaultOptions, ...userOptions };
  const replayProvider$ = provider$.pipe(shareReplay(1), take(1));

  const rxWeb3 = createRxWeb3(provider$);

  rxWeb3
    .getNetwork()
    .pipe(map(createSetNetwork))
    .subscribe(action => store.dispatch(action));

  const getEvents = (filter: FilterObject) =>
    replayProvider$.pipe(
      mergeMap(provider => options.eventReader(provider, filter))
    );

  const contractLoader = (name: string) => createSchemaLoader(store)(name);

  const state$ = new BehaviorSubject<State>(null);

  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: {
      ...rxWeb3,
      getEvents,
      options,
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
    ...rxWeb3,
    provider$: replayProvider$,
    query: query(store, genId, interceptors),

    network$: store.pipe(getDetectedNetwork$),
    defaultAccount$: store.pipe(getActiveAccount$),

    loadContractSchema: contractLoader,

    transaction: (request: Request<string, string, any>) =>
      processTransaction(store, genId)(request).pipe(interceptors.transaction),

    ethCall: (request: Request<string, string, any>) =>
      processCall(store, genId)(request).pipe(interceptors.ethCall)
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
