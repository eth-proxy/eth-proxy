import { Observable } from 'rxjs';
import { RxWeb3, Provider, Block } from '@eth-proxy/rx-web3';
import { QueryModel, EventMetadata } from './modules/events';
import { ContractInfo } from './modules/schema';
import { TransactionHandler, DeploymentInput } from './modules/transaction';
import { EthProxyInterceptors } from './interceptors';
import { EthProxyOptions } from './options';
import { CallHandler } from './modules/call';

export class EthProxy<T extends {} = {}> {
  ethCall: CallHandler<T>;
  transaction: TransactionHandler<T>;
  provider$: Observable<Provider>;
  network$: Observable<string>;
  defaultAccount$: Observable<string | undefined>;

  query: (queryModel: QueryModel<T>) => Observable<any>;
  loadContractSchema: (
    name: Extract<keyof T, string>
  ) => Observable<ContractInfo>;
  deploy: (request: DeploymentInput<string, any>) => Observable<string>;
  getBlock: (block: number) => Observable<Block>;

  // rxweb3
  getBalance: RxWeb3['getBalance'];
  getReceipt: RxWeb3['getReceipt'];
  getTransactionByHash: RxWeb3['getTransactionByHash'];
  watchLatestBlock: RxWeb3['watchLatestBlock'];
  sign: RxWeb3['sign'];
  stop: () => void;
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
