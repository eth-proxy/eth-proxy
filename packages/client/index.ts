import { Observable, BehaviorSubject, timer } from 'rxjs';
import { shareReplay, take, mergeMap } from 'rxjs/operators';
import { createEpicMiddleware } from 'redux-observable';
import {
  getEvents,
  createRxWeb3,
  FilterObject,
  Provider
} from '@eth-proxy/rx-web3';

import { createAppStore, getActiveAccount$, State, rootEpic } from './store';
import { getDetectedNetwork$ } from './store';
import { EthProxy, EthProxyOptions } from './model';
import {
  sendCall,
  createSchemaLoader,
  sendTransaction,
  query,
  deploy
} from './api';
import { createBlockLoader } from './api/get-block';
import {
  createEthProxyStopped,
  createEthProxyStarted
} from './modules/lifecycle';
import { EpicContext } from './context';

const defaultOptions: Partial<EthProxyOptions> = {
  eventReader: getEvents,
  interceptors: {},
  store: undefined,
  watchAccountTimer: timer(0)
};

let globalId = 0;
const genId = () => (globalId++).toString();

export function createProxy<T extends {}>(
  provider$: Observable<Provider>,
  userOptions: EthProxyOptions
): EthProxy<T> {
  const options = { ...defaultOptions, ...userOptions };
  const replayProvider$ = provider$.pipe(
    shareReplay(1),
    take(1)
  );

  const rxWeb3 = createRxWeb3(provider$);

  const getEvents = (filter: FilterObject) =>
    replayProvider$.pipe(
      mergeMap(provider => options.eventReader(provider, filter))
    );

  const contractLoader = (name: string) => createSchemaLoader(store)(name);
  const blockLoader = (number: number) => createBlockLoader(store)(number);

  const context = {
    ...rxWeb3,
    getEvents,
    options,
    contractLoader,
    blockLoader,
    genId
  };

  const epicMiddleware = createEpicMiddleware<any, any, State, EpicContext>({
    dependencies: context
  });
  var store = createAppStore(epicMiddleware, options.store);
  epicMiddleware.run(rootEpic);
  store.dispatch(createEthProxyStarted());

  const deps = {
    ...context,
    store
  };

  const { getBalance, getReceipt, getTransactionByHash, sign } = rxWeb3;

  return {
    getBalance,
    getBlock: blockLoader,
    getReceipt,
    getTransactionByHash,
    sign,

    provider$: replayProvider$,
    query: query(deps),

    network$: store.pipe(getDetectedNetwork$),
    defaultAccount$: store.pipe(getActiveAccount$),

    loadContractSchema: contractLoader,
    transaction: sendTransaction(deps) as any,
    ethCall: sendCall(deps) as any,
    deploy: deploy(deps),
    stop: () => store.dispatch(createEthProxyStopped())
  };
}

export * from './model';
export * from './utils';
export {
  ethProxyIntegrationReducer,
  State as EthProxyState,
  getSelectors
} from './store';
export { ContractInfo, ContractSchema } from './modules/schema';
export * from './modules/request';
export { on, once } from './modules/transaction';
export { at, withOptions } from './modules/request';
export {
  EntityModel,
  EventHandler,
  TransactionHandler,
  getSelectors as getEntitySelectors
} from './entity';

export function entity(arg) {
  return arg;
}
