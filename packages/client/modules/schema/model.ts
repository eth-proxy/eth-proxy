import { SubscribableOrPromise, Observable } from 'rxjs';
import { ContractAbi, AbiDefinition, EventDescription } from '@eth-proxy/rpc';

export interface ContractSchemaExtras {
  address: string;
  genesisBlock: number;
}

export interface ContractSchema extends Partial<ContractSchemaExtras> {
  contractName: string;
  abi: ContractAbi;
  bytecode?: string;
}

export type ContractSchemaResolver = (args: {
  name: string;
}) => SubscribableOrPromise<ContractSchema>;

export type ContractLoader = (name: string) => Observable<ContractInfo>;

export interface NetworkDefinition {
  address: string;
  events: { [topic: string]: EventDescription };
  links: {};
  updated_at: number;
}

export interface ContractInfo {
  address: string;
  name: string;
  genesisBlock: number;
  abi: AbiDefinition[];
  bytecode?: string;
}

export interface TruffleJson {
  contractName: string;
  abi: ContractAbi;
  unlinked_binary: string;
  networks: { [id: string]: NetworkDefinition };
}

export type NameRef<T extends string> = T;
export interface InterfaceRef<T extends string> {
  interface: T;
  address: string;
}

export type ContractRef<T extends string = string> =
  | NameRef<T>
  | InterfaceRef<T>;

export type LoadingRecord<T> = { [P in keyof T]?: undefined } & {
  loading: true;
};

export type ErrorRecord<T> = { [P in keyof T]?: undefined } & { error: any };
