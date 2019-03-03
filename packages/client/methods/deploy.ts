import { DeploymentInput } from '../modules/transaction';
import { isConstructorAbi, deployContract } from '@eth-proxy/rpc';
import { getSchema } from './get-schema';

export function ethDeploy<T>(
  ethProxy: import('../index').EthProxy<T>,
  input: DeploymentInput<Extract<keyof T, string>, any>
) {
  const { payload, interface: contractInterface, ...txParams } = input;

  return getSchema(ethProxy, contractInterface).then(({ abi, bytecode }) => {
    const constructorAbi = abi.find(isConstructorAbi);

    if (!constructorAbi || !bytecode) {
      throw Error(
        `Cannot deploy contract ${contractInterface}, missing abi or bytecode`
      );
    }

    return deployContract(ethProxy, {
      bytecode,
      txParams,
      abi: constructorAbi,
      args: payload
    });
  });
}
