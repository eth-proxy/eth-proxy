export interface FunctionParameter {
  name: string;
  type: string;
}

export interface AbstractDescription {
  type: string;
  name?: string;
}

export interface ConstructorDescription {
  type: 'constructor';
  inputs: Array<FunctionParameter>;
  outputs?: Array<FunctionParameter>;
  constant?: boolean;
  payable?: boolean;
}

export interface FallbackDescription {
  type: 'fallback';
  name: never;
  outputs?: Array<FunctionParameter>;
  constant?: boolean;
  payable?: boolean;
}

export interface FunctionDescription {
  type: 'function';
  name: string;
  inputs: Array<FunctionParameter>;
  outputs?: Array<FunctionParameter>;
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

export type ContractAbi = AbiDefinition[];
export type AbiDefinition =
  | FunctionDescription
  | ConstructorDescription
  | FallbackDescription
  | EventDescription;
