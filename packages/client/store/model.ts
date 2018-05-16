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
  ContractSchemaResolver,
  ContractLoader
} from './models';
import { RxWeb3 } from '@eth-proxy/rx-web3';

export interface State {
  networkId: fromNetwork.State;
  contracts: fromContracts.State;
  accounts: fromAccounts.State;
  transactions: fromTransactions.State;
  blocks: fromBlocks.State;
  events: fromEvents.State;
  calls: fromCalls.State;
}

export interface EpicContext extends RxWeb3 {
  state$: Observable<State>;
  options: EthProxyOptions;
  contractSchemaResolver: ContractSchemaResolver;
  contractLoader: ContractLoader;
}

export * from './models';
