import { Observable } from 'rxjs';
import { ContractSchemaResolver } from './modules/schema';

export type Omit<T, K extends string> = Pick<T, Exclude<keyof T, K>>;

export interface EthProxyOptions {
  contractSchemaResolver: ContractSchemaResolver;
  store?: {
    dispatch: (any: any) => void;
  };
  watchAccountTimer: Observable<any>;
  trackBlocks: boolean;
  subscribeLogs: boolean;
}

export type UserConfig<Defaults extends keyof EthProxyOptions> = {
  [P in keyof Pick<EthProxyOptions, Defaults>]?: EthProxyOptions[P]
} &
  { [P in keyof Omit<EthProxyOptions, Defaults>]: EthProxyOptions[P] };
