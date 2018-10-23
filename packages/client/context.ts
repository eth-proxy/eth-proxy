import { State, ObservableStore } from './store';
import { EthProxyOptions } from './options';
import { ContractLoader } from './modules/schema';
import { BlockLoader } from './modules/blocks';
import { Observable } from 'rxjs';
import { LiftRpc } from './interfaces';

export interface EpicContext {
  options: EthProxyOptions;
  contractLoader: ContractLoader;
  blockLoader: BlockLoader;
  genId: () => string;
  rpc: LiftRpc;
}

export interface Context extends EpicContext {
  store: ObservableStore<State>;
}
