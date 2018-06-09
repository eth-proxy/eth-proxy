import { curry, CurriedFunction2 } from 'ramda';
import { ContractSchema } from './model';

export const LOAD_CONTRACT_SCHEMA = 'LOAD_CONTRACT_SCHEMA';

export interface LoadContractSchema {
  type: typeof LOAD_CONTRACT_SCHEMA;
  payload: {
    name: string;
  };
}

export const createLoadContractSchema = (name: string): LoadContractSchema => ({
  type: LOAD_CONTRACT_SCHEMA,
  payload: {
    name
  }
});

export const LOAD_CONTRACT_SCHEMA_FAILED = 'LOAD_CONTRACT_SCHEMA_FAILED';

export interface LoadContractSchemaFailed {
  type: typeof LOAD_CONTRACT_SCHEMA_FAILED;
  payload: {
    name: string;
    err: any;
  };
}

export const createLoadContractSchemaFailed = curry(
  (name: string, err: any): LoadContractSchemaFailed => ({
    type: LOAD_CONTRACT_SCHEMA_FAILED,
    payload: {
      name,
      err
    }
  })
);

export const LOAD_CONTRACT_SCHEMA_SUCCESS = 'LOAD_CONTRACT_SCHEMA_SUCCESS';

export interface LoadContractSchemaSuccess {
  type: typeof LOAD_CONTRACT_SCHEMA_SUCCESS;
  payload: ContractSchema;
}

export const createLoadContractSchemaSuccess = (
  payload: LoadContractSchemaSuccess['payload']
): LoadContractSchemaSuccess => ({
  type: LOAD_CONTRACT_SCHEMA_SUCCESS,
  payload
});

export type Types =
  | LoadContractSchema
  | LoadContractSchemaFailed
  | LoadContractSchemaSuccess;
