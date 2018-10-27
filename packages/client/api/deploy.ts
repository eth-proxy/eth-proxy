import { combineLatest } from 'rxjs';

import { getTxParams } from '../store';
import { Context } from '../context';
import { mergeMap, map } from 'rxjs/operators';
import {
  isConstructorAbi,
  deployContract,
  getReceipt
} from '@eth-proxy/rx-web3';
import * as fromTx from '../modules/transaction';

/* 
  Only sutiable for testrpc
*/
export function deploy({ store, contractLoader, provider }: Context) {
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
        return deployContract(provider, {
          abi,
          args: input.payload,
          bytecode: schema.bytecode,
          txParams
        }).pipe(
          mergeMap(getReceipt(provider)),
          map(x => x.contractAddress)
        );
      })
    );
  };
}
