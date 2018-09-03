import { curry } from 'ramda';
import { getMethodAbi, encodeArgs } from '../../utils';
import { TransactionPayload, AbiDefinition, Provider } from '../../interfaces';
import { sendTransactionWithPayload } from './send-transaction';

interface DeploymentInput<T = any> {
  abi: AbiDefinition[];
  args: T;
  txParams: TransactionPayload;
  bytecode: string;
}

export const deployContract = curry(
  (provider: Provider, input: DeploymentInput) => {
    return sendTransactionWithPayload<string>(provider, {
      ...input.txParams,
      data: toDeploymentData(input)
    });
  }
);

function toDeploymentData({ abi, args, bytecode }: DeploymentInput) {
  const constructorAbi = getMethodAbi(abi, 'constructor');

  const constructorBytecode = constructorAbi
    ? encodeArgs(constructorAbi, args)
    : '';

  return bytecode + constructorBytecode;
}
