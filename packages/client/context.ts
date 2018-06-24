import { RxWeb3 } from '@eth-proxy/rx-web3';

import { State, ObservableStore } from './store';
import { EthProxyOptions } from './model';
import { ContractLoader } from './modules/schema';

export interface EpicContext extends RxWeb3 {
  options: EthProxyOptions;
  contractLoader: ContractLoader;
  genId: () => string;
}

export interface Context extends EpicContext {
  store: ObservableStore<State>;
}
