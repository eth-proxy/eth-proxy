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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { createAppStore, getActiveAccount$, State, rootEpic } from './store';
import { getDetectedNetwork$ } from './store';
import { EthProxy, EthProxyOptions } from './model';
import { sendCall, createSchemaLoader, sendTransaction, query } from './api';
import { empty } from 'rxjs/observable/empty';

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
  const state$ = new BehaviorSubject<State>(null);

  const rxWeb3 = createRxWeb3(provider$);

  const getEvents = (filter: FilterObject) =>
    replayProvider$.pipe(
      mergeMap(provider => options.eventReader(provider, filter))
    );

  const contractLoader = (name: string) => createSchemaLoader(store)(name);

  const context = {
    ...rxWeb3,
    getEvents,
    options,
    state$,
    contractLoader,
    genId
  };

  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: context
  });

  var store = createAppStore(epicMiddleware, options.store);
  store.select(x => x).subscribe(state$);

  const deps = {
    ...context,
    store
  };

  return {
    ...rxWeb3,
    provider$: replayProvider$,
    query: query(deps),

    network$: store.pipe(getDetectedNetwork$),
    defaultAccount$: store.pipe(getActiveAccount$),

    loadContractSchema: contractLoader,
    transaction: sendTransaction(deps) as any,
    ethCall: sendCall(deps) as any,
    stop: () => epicMiddleware.replaceEpic(() => empty())
  };
}

export * from './model';
export * from './utils';
export { ethProxyIntegrationReducer, State as EthProxyState } from './store';
export { ContractInfo } from './modules/schema';
export * from './modules/request';
export {
  EntityModel,
  EventHandler,
  TransactionHandler,
  getSelectors
} from './entity';
export { on, once } from './modules/transaction';
export { at, withOptions } from './modules/request';

export function entity(arg) {
  return arg;
}
