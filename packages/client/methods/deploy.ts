import { DeploymentInput } from '../modules/transaction';
import { mergeMap } from 'rxjs/operators';
import { isConstructorAbi, deployContract } from '@eth-proxy/rpc';

export function deploy<T>(
  ethProxy: import('../index').EthProxy<T>,
  input: DeploymentInput<Extract<keyof T, string>, any>
) {
  const { payload, interface: contractInterface, ...txParams } = input;

  return ethProxy
    .loadContractSchema(contractInterface)
    .pipe(
      mergeMap(({ abi, bytecode }) => {
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
      })
    )
    .toPromise();
}
