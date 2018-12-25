import { curry } from 'ramda';
import { ConstructorDescription, Provider } from '../../interfaces';
import {
  sendTransactionWithData,
  TransactionInputParams
} from './send-transaction';
import { encodeFromObjOrSingle } from '../../coder';

export interface DeploymentInput<T = any> {
  abi: ConstructorDescription;
  args: T;
  txParams: TransactionInputParams;
  bytecode: string;
}

export const deployContract = curry(
  (provider: Provider, input: DeploymentInput) => {
    return sendTransactionWithData(provider, {
      ...input.txParams,
      data: toDeploymentData(input)
    });
  }
);

export function toDeploymentData({ abi, args, bytecode }: DeploymentInput) {
  return `${bytecode}${encodeFromObjOrSingle(abi, args)}`;
}
