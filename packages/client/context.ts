import { RxWeb3 } from '@eth-proxy/rx-web3';

import { State, ObservableStore } from './store';
import { EthProxyOptions } from './model';
import { ContractLoader } from './modules/schema';
import { BlockLoader } from './modules/blocks';

export interface EpicContext extends RxWeb3 {
  options: EthProxyOptions;
  contractLoader: ContractLoader;
  blockLoader: BlockLoader;
  genId: () => string;
}

export interface Context extends EpicContext {
  store: ObservableStore<State>;
}
