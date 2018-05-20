import * as fromAccounts from '../modules/account';
import * as fromBlocks from '../modules/blocks';
import * as fromNetwork from '../modules/network';
import * as fromEvents from '../modules/events';
import * as fromSchema from '../modules/schema';
import * as fromTransactions from '../modules/transaction';
import * as fromCalls from '../modules/call';

export interface State {
  networkId: fromNetwork.State;
  contracts: fromSchema.State;
  [fromAccounts.moduleId]: fromAccounts.State;
  transactions: fromTransactions.State;
  blocks: fromBlocks.State;
  events: fromEvents.State;
  calls: fromCalls.State;
}
