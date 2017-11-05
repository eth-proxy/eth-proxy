import { TruffleJson } from "../../model";

export const REGISTER_CONTRACT = "REGISTER_CONTRACT";

export interface RegisterContractOptions {
  address: string;
  genesisBlock: number;
}

export interface RegisterContract {
  type: "REGISTER_CONTRACT";
  payload: TruffleJson & RegisterContractOptions;
}

export const createRegisterConract = (
  json: TruffleJson,
  options: RegisterContractOptions
): RegisterContract => ({
  type: REGISTER_CONTRACT,
  payload: {
    ...json,
    ...options
  }
});

export type ContractTypes = RegisterContract;