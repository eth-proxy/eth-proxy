import { Observable } from 'rxjs/Observable';
import { EthProxyInterceptors } from './interceptors';
import { ContractSchemaResolver } from './contract';
import { Provider, FilterObject, BlockchainEvent } from '@eth-proxy/rx-web3';

export interface EthProxyOptions {
  pollInterval?: number;
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
