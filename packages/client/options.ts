import { Observable } from 'rxjs';
import { EthProxyInterceptors } from './interceptors';
import { ContractSchemaResolver } from './modules/schema';
import { Provider, FilterObject, Log } from '@eth-proxy/rpc';

export interface EthProxyOptions {
  contractSchemaResolver: ContractSchemaResolver;
  store?: {
    dispatch: Function;
  };
  interceptors?: Partial<EthProxyInterceptors>;
  watchAccountTimer?: Observable<any>;
  watchBlocksTimer$?: Observable<any>;
  watchLogsTimer$?: Observable<any>;
}
