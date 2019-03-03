import { Observable } from 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import {
  Provider,
  RpcSend,
  send,
  SendRequest,
  applyMiddleware,
  blockNumber,
  mergeProviders,
  defaultAccountMiddleware,
  getDefaultAccount
} from '@eth-proxy/rpc';

import { createAppStore, State, rootEpic, ObservableStore } from './store';
import { sendTransaction, query } from './api';
import {
  createEthProxyStopped,
  createEthProxyStarted
} from './modules/lifecycle';
import { EpicContext } from './context';
import { QueryModel } from './modules/events';
import { TransactionHandler } from './modules/transaction';
import { EthProxyOptions, UserConfig } from './options';
import { connectStoreMiddleware, connectSubscriptions } from './middleware';
import { schemaSubprovider } from './providers';

export class EthProxy<T extends {} = {}> implements Provider {
  transaction!: TransactionHandler<T>;

  query!: (queryModel: QueryModel<T>) => Observable<any>;

  rpc!: SendRequest;
  send!: RpcSend;

  observe!: Provider['observe'];
  disconnect!: Provider['disconnect'];
}

const defaultOptions = {
  store: undefined,
  subscribeLogs: false
};

let globalId = 0;
const genId = () => (globalId++).toString();

export function createProxy<T extends {}>(
  injectedProvider: Provider,
  userOptions: UserConfig<keyof typeof defaultOptions>
): EthProxy<T> {
  let store: ObservableStore<State>;

  const options: EthProxyOptions = { ...defaultOptions, ...userOptions };

  const provider: Provider = applyMiddleware(
    [
      defaultAccountMiddleware(
        () => getDefaultAccount(provider) as Promise<string>
      ),
      connectStoreMiddleware({
        providerRef: () => provider,
        dispatch: action => store.dispatch(action)
      }),
      connectSubscriptions({
        providerRef: () => provider,
        dispatch: action => store.dispatch(action)
      })
    ],
    mergeProviders([
      schemaSubprovider(options.contractSchemaLoader),
      injectedProvider
    ])
  );

  const context = {
    options,
    genId,
    provider
  };

  const epicMiddleware = createEpicMiddleware<any, any, State, EpicContext>({
    dependencies: context
  });

  store = createAppStore(epicMiddleware, options.store);
  epicMiddleware.run(rootEpic);
  store.dispatch(createEthProxyStarted());

  const deps = {
    ...context,
    store
  };

  const rpc = send(provider);

  // Should not be necessary but its still used in some parts
  blockNumber(provider);

  return {
    ...provider,

    query: query(deps),
    transaction: sendTransaction(deps) as any,

    rpc,

    disconnect: () => {
      store.dispatch(createEthProxyStopped());
      injectedProvider.disconnect();
    }
  };
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
export { idFromEvent } from './utils';
export * from './middleware';
export * from './methods';
export * from './providers';

export function entity(arg: any) {
  return arg;
}
