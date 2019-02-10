import { Observable } from 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import {
  Provider,
  RpcSend,
  send,
  SendRequest,
  applyMiddleware,
  blockNumber
} from '@eth-proxy/rpc';

import { createAppStore, State, rootEpic, ObservableStore } from './store';
import {
  sendCall,
  createSchemaLoader,
  sendTransaction,
  query,
  deploy
} from './api';
import {
  createEthProxyStopped,
  createEthProxyStarted
} from './modules/lifecycle';
import { EpicContext } from './context';
import { QueryModel } from './modules/events';
import { ContractInfo } from './modules/schema';
import { TransactionHandler, DeploymentInput } from './modules/transaction';
import { EthProxyOptions, UserConfig } from './options';
import { CallHandler } from './modules/call';
import { connectStoreMiddleware, connectSubscriptions } from './middleware';

export class EthProxy<T extends {} = {}> implements Provider {
  ethCall!: CallHandler<T>;
  transaction!: TransactionHandler<T>;

  query!: (queryModel: QueryModel<T>) => Observable<any>;
  loadContractSchema!: (
    name: Extract<keyof T, string>
  ) => Observable<ContractInfo>;
  deploy!: (request: DeploymentInput<string, any>) => Observable<string>;

  rpc!: SendRequest;
  send!: RpcSend;

  observe!: (subscriptionId: string) => Observable<any>;
  disconnect!: () => void;
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

  const contractLoader = (name: string) => createSchemaLoader(store)(name);

  const provider: Provider = applyMiddleware(
    [
      connectStoreMiddleware({
        providerRef: () => provider,
        dispatch: action => store.dispatch(action)
      }),
      connectSubscriptions({
        providerRef: () => provider,
        dispatch: action => store.dispatch(action)
      })
    ],
    injectedProvider
  );

  const context = {
    options,
    contractLoader,
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

    loadContractSchema: contractLoader,
    transaction: sendTransaction(deps) as any,
    ethCall: sendCall(deps) as any,
    deploy: deploy(deps),

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

export function entity(arg: any) {
  return arg;
}
