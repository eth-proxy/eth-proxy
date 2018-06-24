import { Observable } from 'rxjs';
import { EthProxyInterceptors } from './interceptors';
import { ContractSchemaResolver } from './modules/schema';
import { Provider, FilterObject, BlockchainEvent } from '@eth-proxy/rx-web3';

export interface EthProxyOptions {
  eventReader?: (
    provider: Provider,
    options: FilterObject
  ) => Observable<BlockchainEvent[]>;
  store?: {
    dispatch: Function;
  };
  interceptors?: Partial<EthProxyInterceptors>;
  contractSchemaResolver: ContractSchemaResolver;
}
