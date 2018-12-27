import { Observable } from 'rxjs';
import { EthProxyInterceptors } from './interceptors';
import { ContractSchemaResolver } from './modules/schema';

export type Omit<T, K extends string> = Pick<T, Exclude<keyof T, K>>;

export interface EthProxyOptions {
  contractSchemaResolver: ContractSchemaResolver;
  store?: {
    dispatch: (any: any) => void;
  };
  interceptors: Partial<EthProxyInterceptors>;
  watchAccountTimer: Observable<any>;
  watchLogsTimer$?: Observable<any>;
  trackBlocks: boolean;
}

export type UserConfig<Defaults extends keyof EthProxyOptions> = {
  [P in keyof Pick<EthProxyOptions, Defaults>]?: EthProxyOptions[P]
} &
  { [P in keyof Omit<EthProxyOptions, Defaults>]: EthProxyOptions[P] };
