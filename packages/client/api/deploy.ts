import { combineLatest } from 'rxjs';

import { getTxParams } from '../store';
import { Context } from '../context';
import { mergeMap, map } from 'rxjs/operators';
import {
  isConstructorAbi,
  getReceipt,
  deployContract
} from '@eth-proxy/rx-web3';
import * as fromTx from '../modules/transaction';

/* 
  Only sutiable for testrpc
*/
export function deploy({ store, contractLoader, rpc }: Context) {
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
        const deployment = deployContract({
          abi,
          args: input.payload,
          bytecode: schema.bytecode,
          txParams
        });

        return rpc(deployment).pipe(
          mergeMap(address => rpc(getReceipt(address))),
          map(x => x.contractAddress)
        );
      })
    );
  };
}
