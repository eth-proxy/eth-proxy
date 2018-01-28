import { Observable } from 'rxjs/Observable';
import * as Web3 from 'web3';
import { QueryModel, Block, ContractInfo, RequestHandlers } from './store';

export class EthProxy<T extends {} = {}> extends RequestHandlers<T> {
  query: (queryModel: QueryModel<T>) => Observable<any>;

  // rxweb3
  getBalance: (account: string) => Observable<any>;
  getLatestBlock: () => Observable<Block>;
  getBlock: (args) => Observable<Block>;

  provider$: Observable<Web3.Provider>;
  network$: Observable<string>;
  defaultAccount$: Observable<string | undefined>;

  loadContractSchema: (name: keyof T) => Observable<ContractInfo>;
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
