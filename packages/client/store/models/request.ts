export interface ContractDefaults {
  from?: string;
  gas?: string;
  gasPrice?: string;
  value?: string;
}

export interface ProcessRequestArgs {
  abi;
  address;
  method;
  args;
  txParams;
}
