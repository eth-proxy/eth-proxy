import * as fromAccounts from '../modules/account';
import * as fromBlocks from '../modules/blocks';
import * as fromNetwork from '../modules/network';
import * as fromEvents from '../modules/events';
import * as fromSchema from '../modules/schema';
import * as fromTransactions from '../modules/transaction';

export interface State {
  [fromNetwork.moduleId]: fromNetwork.State;
  [fromSchema.moduleId]: fromSchema.State;
  [fromAccounts.moduleId]: fromAccounts.State;
  [fromTransactions.moduleId]: fromTransactions.State;
  [fromBlocks.moduleId]: fromBlocks.State;
  [fromEvents.moduleId]: fromEvents.State;
}
