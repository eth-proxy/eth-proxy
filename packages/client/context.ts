import { Provider } from '@eth-proxy/rpc';
import { State, ObservableStore } from './store';
import { EthProxyOptions } from './options';
import { ContractLoader } from './modules/schema';
import { BlockLoader } from './modules/blocks';

export interface EpicContext {
  options: EthProxyOptions;
  contractLoader: ContractLoader;
  blockLoader: BlockLoader;
  genId: () => string;
  provider: Provider;
}

export interface Context extends EpicContext {
  store: ObservableStore<State>;
}
