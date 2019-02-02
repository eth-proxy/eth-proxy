import { Observable, timer } from 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import { Provider, Block, RpcSend, send, SendRequest } from '@eth-proxy/rpc';

import {
  createAppStore,
  getActiveAccount$,
  State,
  rootEpic,
  getDetectedNetwork$
} from './store';
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
import { QueryModel } from './modules/events';
import { ContractInfo } from './modules/schema';
import { TransactionHandler, DeploymentInput } from './modules/transaction';
import { EthProxyOptions, UserConfig } from './options';
import { CallHandler } from './modules/call';

export class EthProxy<T extends {} = {}> implements Provider {
  ethCall!: CallHandler<T>;
  transaction!: TransactionHandler<T>;
  network$!: Observable<string>;
  defaultAccount$!: Observable<string | null>;

  query!: (queryModel: QueryModel<T>) => Observable<any>;
  loadContractSchema!: (
    name: Extract<keyof T, string>
  ) => Observable<ContractInfo>;
  deploy!: (request: DeploymentInput<string, any>) => Observable<string>;
  getBlock!: (block: number) => Observable<Block>;

  rpc!: SendRequest;
  send!: RpcSend;

  observe!: (subscriptionId: string) => Observable<any>;
  disconnect!: () => void;
}

const defaultOptions = {
  interceptors: {},
  store: undefined,
  watchAccountTimer: timer(0),
  trackBlocks: false,
  subscribeLogs: true
};

let globalId = 0;
const genId = () => (globalId++).toString();

export function createProxy<T extends {}>(
  provider: Provider,
  userOptions: UserConfig<keyof typeof defaultOptions>
): EthProxy<T> {
  const options: EthProxyOptions = { ...defaultOptions, ...userOptions };

  const contractLoader = (name: string) => createSchemaLoader(store)(name);
  const blockLoader = (number: number) => createBlockLoader(store)(number);

  const context = {
    options,
    contractLoader,
    blockLoader,
    genId,
    provider
  };

  const epicMiddleware = createEpicMiddleware<any, any, State, EpicContext>({
    dependencies: context
  });
  const store = createAppStore(epicMiddleware, options.store);
  epicMiddleware.run(rootEpic);
  store.dispatch(createEthProxyStarted());

  const deps = {
    ...context,
    store
  };

  const rpc = send(provider);

  return {
    ...provider,
    getBlock: blockLoader,

    query: query(deps),

    network$: store.pipe(getDetectedNetwork$),
    defaultAccount$: store.pipe(getActiveAccount$),

    loadContractSchema: contractLoader,
    transaction: sendTransaction(deps) as any,
    ethCall: sendCall(deps) as any,
    deploy: deploy(deps),

    rpc,

    disconnect: () => {
      store.dispatch(createEthProxyStopped());
      provider.disconnect();
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
export { EthProxyInterceptors } from './interceptors';
export { idFromEvent } from './utils';

export function entity(arg: any) {
  return arg;
}
