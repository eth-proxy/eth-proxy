import { SchemaLoader } from './providers/schema.provider';

export type Omit<T, K extends string> = Pick<T, Exclude<keyof T, K>>;

export interface EthProxyOptions {
  contractSchemaLoader: SchemaLoader;
  store?: {
    dispatch: (any: any) => void;
  };
  subscribeLogs: boolean;
}

export type UserConfig<Defaults extends keyof EthProxyOptions> = {
  [P in keyof Pick<EthProxyOptions, Defaults>]?: EthProxyOptions[P]
} &
  { [P in keyof Omit<EthProxyOptions, Defaults>]: EthProxyOptions[P] };
