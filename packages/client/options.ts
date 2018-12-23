import { Observable } from 'rxjs';
import { EthProxyInterceptors } from './interceptors';
import { ContractSchemaResolver } from './modules/schema';

export interface EthProxyOptions {
  contractSchemaResolver: ContractSchemaResolver;
  store?: {
    dispatch: Function;
  };
  interceptors?: Partial<EthProxyInterceptors>;
  watchAccountTimer?: Observable<any>;
  watchLogsTimer$?: Observable<any>;
  trackBlocks?: boolean;
}
