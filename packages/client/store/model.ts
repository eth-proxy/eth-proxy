import { Observable } from "rxjs/Observable";
import * as Web3 from 'web3';
import { EthProxyOptions } from "../model";

import * as fromNetwork from "./reducers/network";
import * as fromContracts from "./reducers/contracts";
import * as fromAccounts from "./reducers/accounts";
import * as fromTransactions from "./reducers/transactions";
import * as fromBlocks from "./reducers/blocks";
import * as fromEvents from "./reducers/events";

export interface State {
  networkId: fromNetwork.State;
  contracts: fromContracts.State;
  accounts: fromAccounts.State;
  transactions: fromTransactions.State;
  blocks: fromBlocks.State;
  events: fromEvents.State;
}

export interface EpicContext {
  web3Proxy$ : Observable<Web3>;
  options: EthProxyOptions;
  getEvents: (options: Web3.FilterObject) => Observable<any[]>;
  watchEvents: (options: Web3.FilterObject) => Observable<any>;
}