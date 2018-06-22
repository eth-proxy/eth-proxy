import { Observable } from 'rxjs';
import { RxWeb3, Provider } from '@eth-proxy/rx-web3';
import { QueryModel, EventMetadata } from './modules/events';
import { ContractInfo } from './modules/schema';
import { TransactionHandler } from './modules/transaction';
import { EthProxyInterceptors } from './interceptors';
import { EthProxyOptions } from './options';
import { CallHandler } from './modules/call';

export class EthProxy<T extends {} = {}> implements RxWeb3 {
  ethCall: CallHandler<T>;
  transaction: TransactionHandler<T>;
  provider$: Observable<Provider>;
  network$: Observable<string>;
  defaultAccount$: Observable<string | undefined>;

  query: (queryModel: QueryModel<T>) => Observable<any>;
  loadContractSchema: (name: keyof T) => Observable<ContractInfo>;

  // rxweb3
  getBalance: RxWeb3['getBalance'];
  getBlock: RxWeb3['getBlock'];
  getDefaultAccount: RxWeb3['getDefaultAccount'];
  getEvents: RxWeb3['getEvents'];
  getNetwork: RxWeb3['getNetwork'];
  getReceipt: RxWeb3['getReceipt'];
  getTransaction: RxWeb3['getTransaction'];
  watchEvents: RxWeb3['watchEvents'];
  watchLatestBlock: RxWeb3['watchLatestBlock'];
  sendTransaction: RxWeb3['sendTransaction'];
  sendCall: RxWeb3['sendCall'];
}

export {
  TransactionWithHash,
  Transaction,
  TransactionConfirmation,
  ObservableTransactionResult,
  ConfirmedTransaction,
  InitializedTransaction
} from './modules/transaction';

export { RequestFactory, ContractsAggregation } from './modules/request';
export { ContractInfo } from './modules/schema';
export { EventMetadata, QueryModel } from './modules/events';
export { EthProxyInterceptors, EthProxyOptions };
