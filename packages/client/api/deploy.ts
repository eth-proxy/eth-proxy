import { combineLatest } from 'rxjs';

import { getTxParams } from '../store';
import { Context } from '../context';
import { mergeMap, map } from 'rxjs/operators';
import { isConstructorAbi } from '@eth-proxy/rx-web3';
import * as fromTx from '../modules/transaction';

/* 
  Only sutiable for testrpc
*/
export function deploy({
  store,
  deployContract,
  contractLoader,
  getReceipt
}: Context) {
  return (input: fromTx.DeploymentInput<string, any>) => {
    return combineLatest(
      store.pipe(getTxParams(input)),
      contractLoader(input.interface)
    ).pipe(
      mergeMap(([txParams, schema]) => {
        const abi = schema.abi.find(isConstructorAbi);
        if (!abi || !schema.bytecode) {
          throw Error(
            `Cannot deploy contract ${input.interface}, missing abi or bytecode`
          );
        }
        return deployContract({
          abi,
          args: input.payload,
          bytecode: schema.bytecode,
          txParams
        }).pipe(
          mergeMap(getReceipt),
          map(x => x.contractAddress)
        );
      })
    );
  };
}
