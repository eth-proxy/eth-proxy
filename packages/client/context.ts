import { Provider } from '@eth-proxy/rpc';
import { State, ObservableStore } from './store';
import { EthProxyOptions } from './options';

export interface EpicContext {
  options: EthProxyOptions;
  genId: () => string;
  provider: Provider;
}

export interface Context extends EpicContext {
  store: ObservableStore<State>;
}
