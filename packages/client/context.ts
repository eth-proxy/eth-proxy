import { Observable } from 'rxjs/Observable';
import { RxWeb3 } from '@eth-proxy/rx-web3';
import { State } from './store';
import { EthProxyOptions } from './model';
import { ContractSchemaResolver, ContractLoader } from './modules/schema';

export interface EpicContext extends RxWeb3 {
  state$: Observable<State>;
  options: EthProxyOptions;
  contractSchemaResolver: ContractSchemaResolver;
  contractLoader: ContractLoader;
}
