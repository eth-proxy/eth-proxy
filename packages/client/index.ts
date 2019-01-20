import { Observable, timer, EMPTY } from 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import {
  Provider,
  RpcSend,
  send,
  SendRequest,
  subscribeNewHeads,
  getBlockByNumber,
  getDefaultAccount,
  getNetwork
} from '@eth-proxy/rpc';

import {
  createAppStore,
  getActiveAccount$,
  State,
  rootEpic,
  getDetectedNetwork$,
  ObservableStore
} from './store';
import { sendTransaction, query, deploy } from './api';
import { EpicContext } from './context';
import { QueryModel } from './modules/events';
import { TransactionHandler, DeploymentInput } from './modules/transaction';
import { EthProxyOptions, UserConfig } from './options';
import { connectProvider } from './connect-provider';
import { retryWhen, delay, mergeMap } from 'rxjs/operators';

export class EthProxy<T extends {} = {}> implements Provider {
  transaction!: TransactionHandler<T>;
  network$!: Observable<string>;
  defaultAccount$!: Observable<string | null>;

  query!: (queryModel: QueryModel<T>) => Observable<any>;
  deploy!: (request: DeploymentInput<string, any>) => Observable<string>;

  rpc!: SendRequest;
  send!: RpcSend;

  observe!: (subscriptionId?: string) => Observable<any>;
  disconnect!: () => void;
}

const defaultOptions = {
  interceptors: {},
  store: undefined,
  watchAccountTimer: timer(0),
  trackBlocks: false
};

let globalId = 0;
const genId = () => (globalId++).toString();

export function createProxy<T extends {}>(
  provider: Provider,
  userOptions: UserConfig<keyof typeof defaultOptions>
): EthProxy<T> {
  let store: ObservableStore<State>;

  const connectedProvider = connectProvider(
    action => store.dispatch(action),
    provider
  );

  const options: EthProxyOptions = { ...defaultOptions, ...userOptions };

  const context = {
    options,
    genId,
    provider: connectedProvider
  };

  const epicMiddleware = createEpicMiddleware<any, any, State, EpicContext>({
    dependencies: context
  });
  store = createAppStore(epicMiddleware, options.store);
  epicMiddleware.run(rootEpic);

  const deps = {
    ...context,
    store
  };

  const rpc = send(connectedProvider);

  loadNetwork(options, connectedProvider);
  const sub = trackBlocks(options, connectedProvider);
  sub.add(watchAccount(options, connectedProvider));

  return {
    ...connectedProvider,
    query: query(deps),

    network$: store.pipe(getDetectedNetwork$),
    defaultAccount$: store.pipe(getActiveAccount$),

    transaction: sendTransaction(deps) as any,
    deploy: deploy(deps),

    rpc,

    disconnect: () => {
      sub.unsubscribe();
      provider.disconnect();
    }
  };
}

function trackBlocks(options: EthProxyOptions, provider: Provider) {
  getBlockByNumber(provider, { number: 'latest' });

  const tracker$ = options.trackBlocks
    ? subscribeNewHeads(provider, {}).pipe(retryWhen(delay(5000)))
    : EMPTY;

  return tracker$.subscribe();
}

function watchAccount(options: EthProxyOptions, provider: Provider) {
  return options.watchAccountTimer
    .pipe(mergeMap(() => getDefaultAccount(provider)))
    .subscribe();
}

function loadNetwork(_: EthProxyOptions, provider: Provider) {
  return getNetwork(provider);
}

export {
  ethProxyIntegrationReducer,
  State as EthProxyState,
  getSelectors
} from './store';
export * from './modules/request';
export { on, once } from './modules/transaction';
export { at, withOptions } from './modules/request';
export {
  EntityModel,
  EventHandler,
  TransactionHandler,
  getSelectors as getEntitySelectors
} from './entity';
export {
  TransactionWithHash,
  Transaction,
  TransactionConfirmation,
  ObservableTransactionResult,
  ConfirmedTransaction,
  InitializedTransaction
} from './modules/transaction';

export { RequestFactory, ContractsAggregation } from './modules/request';
export { QueryModel } from './modules/events';
export { EthProxyOptions } from './options';
export { EthProxyInterceptors } from './interceptors';
export { idFromEvent } from './utils';

export function entity(arg: any) {
  return arg;
}
export * from './methods';
export * from './middleware';
