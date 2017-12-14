declare module "*.json" {
  const value: any;
  export default value;
}
declare var requireDir: any;

type ContractAbi = Array<AbiDefinition>;

type AbiDefinition = FunctionDescription | EventDescription;

interface FunctionDescription {
  type: "function" | "constructor" | "fallback";
  name?: string;
  inputs: Array<FunctionParameter>;
  outputs: Array<FunctionParameter>;
  constant?: boolean;
  payable?: boolean;
}

interface EventParameter {
  name: string;
  type: string;
  indexed: boolean;
}

interface EventDescription {
  type: "event";
  name: string;
  inputs: Array<EventParameter>;
  anonymous: boolean;
}

interface FunctionParameter {
  name: string;
  type: string;
}

interface TruffleJson {
  contract_name: string;
  abi: ContractAbi;
}
