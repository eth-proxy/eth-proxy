import * as Web3 from 'web3';
import { Observable } from 'rxjs/Observable';
import { EthProxyInterceptors } from './interceptors';
import { ContractSchemaResolver } from './contract';

export interface EthProxyOptions {
  pollInterval?: number;
  eventReader?: (web3: Web3, options: Web3.FilterObject) => Observable<any[]>;
  store?: {
    dispatch: Function;
  };
  interceptors?: Partial<EthProxyInterceptors>;
  contractSchemaResolver: ContractSchemaResolver;
}
