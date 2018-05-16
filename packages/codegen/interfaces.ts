export type ContractAbi = Array<AbiDefinition>;

export type AbiDefinition = FunctionDescription | EventDescription;

export interface FunctionDescription {
  type: 'function' | 'constructor' | 'fallback';
  name?: string;
  inputs: Array<FunctionParameter>;
  outputs: Array<FunctionParameter>;
  constant?: boolean;
  payable?: boolean;
}

export interface EventParameter {
  name: string;
  type: string;
  indexed: boolean;
}

export interface EventDescription {
  type: 'event';
  name: string;
  inputs: Array<EventParameter>;
  anonymous: boolean;
}

export interface FunctionParameter {
  name: string;
  type: string;
}

export interface TruffleJson {
  contractName: string;
  abi: ContractAbi;
}
