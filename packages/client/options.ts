import { Observable } from 'rxjs';
import { EthProxyInterceptors } from './interceptors';
import { ContractSchemaResolver } from './modules/schema';
import { Provider, FilterObject, Log } from '@eth-proxy/rx-web3';

export interface EthProxyOptions {
  contractSchemaResolver: ContractSchemaResolver;
  eventReader?: (
    provider: Provider,
    options: FilterObject
  ) => Observable<Log[]>;
  store?: {
    dispatch: Function;
  };
  interceptors?: Partial<EthProxyInterceptors>;
  watchBlocks?: boolean;
  watchAccountTimer?: Observable<any>;
}
