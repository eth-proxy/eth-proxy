import * as fromNetwork from './reducers/network';
import * as fromContracts from './reducers/contracts';
import * as fromAccounts from './reducers/accounts';
import * as fromTransactions from './reducers/transactions';
import * as fromBlocks from './reducers/blocks';
import * as fromEvents from './reducers/events';
import * as fromCalls from './reducers/calls';
import { Observable } from 'rxjs/Observable';

import {
  EthProxyOptions,
  ProcessRequestArgs,
  ContractSchemaResolver,
  ContractLoader
} from './models';
import * as Web3 from 'web3';

export interface State {
  networkId: fromNetwork.State;
  contracts: fromContracts.State;
  accounts: fromAccounts.State;
  transactions: fromTransactions.State;
  blocks: fromBlocks.State;
  events: fromEvents.State;
  calls: fromCalls.State;
}

export interface EpicContext {
  web3Proxy$: Observable<Web3>;
  state$: Observable<State>;
  options: EthProxyOptions;
  getEvents: (options: Web3.FilterObject) => Observable<any[]>;
  watchEvents: (options: Web3.FilterObject) => Observable<any>;
  processTransaction: (args: ProcessRequestArgs) => Observable<any>;
  processCall: (args: ProcessRequestArgs) => Observable<any>;
  contractSchemaResolver: ContractSchemaResolver;
  contractLoader: ContractLoader;
}

export * from './models';
