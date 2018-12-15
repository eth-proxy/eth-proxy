import { Observable, timer } from 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import { Provider, Block, RpcSend, send, SendRequest } from '@eth-proxy/rpc';

import { createAppStore, getActiveAccount$, State, rootEpic } from './store';
import { getDetectedNetwork$ } from './store';
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
import { EthProxyOptions } from './options';
import { CallHandler } from './modules/call';

export class EthProxy<T extends {} = {}> implements Provider {
  ethCall: CallHandler<T>;
  transaction: TransactionHandler<T>;
  network$: Observable<string>;
  defaultAccount$: Observable<string | undefined>;

  query: (queryModel: QueryModel<T>) => Observable<any>;
  loadContractSchema: (
    name: Extract<keyof T, string>
  ) => Observable<ContractInfo>;
  deploy: (request: DeploymentInput<string, any>) => Observable<string>;
  getBlock: (block: number) => Observable<Block>;

  rpc: SendRequest;
  send: RpcSend;
  stop: () => void;

  // not implemented
  observe: (subscriptionId: string) => Observable<any>;
  disconnect: () => void;
}

const defaultOptions: Partial<EthProxyOptions> = {
  interceptors: {},
  store: undefined,
  watchAccountTimer: timer(0)
};

let globalId = 0;
const genId = () => (globalId++).toString();

export function createProxy<T extends {}>(
  provider: Provider,
  userOptions: EthProxyOptions
): EthProxy<T> {
  const options = { ...defaultOptions, ...userOptions };

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
  var store = createAppStore(epicMiddleware, options.store);
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

    stop: () => store.dispatch(createEthProxyStopped())
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
export function entity(arg) {
  return arg;
}
