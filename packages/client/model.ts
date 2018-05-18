import { Observable } from 'rxjs/Observable';
import { QueryModel, ContractInfo, RequestHandlers } from './store';
import { RxWeb3, Provider } from '@eth-proxy/rx-web3';

export class EthProxy<T extends {} = {}> extends RequestHandlers<T>
  implements RxWeb3 {
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
  EthProxyInterceptors,
  ContractInfo,
  EventMetadata,
  ConfirmedTransaction,
  RequestFactory,
  InitializedTransaction,
  EthProxyOptions,
  ContractsAggregation
} from './store';
