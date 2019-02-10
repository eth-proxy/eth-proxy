import { combineLatest, from } from 'rxjs';

import { Context } from '../context';
import { mergeMap, map } from 'rxjs/operators';
import {
  isConstructorAbi,
  deployContract,
  getReceipt,
  getDefaultAccount
} from '@eth-proxy/rpc';
import * as fromTx from '../modules/transaction';

/* 
  Only sutiable for testrpc
*/
export function deploy({ contractLoader, provider }: Context) {
  return (input: fromTx.DeploymentInput<string, any>) => {
    const txParams$ = getDefaultAccount(provider).then(account =>
      fromTx.mergeParams(input, { from: account })
    );

    return combineLatest(txParams$, contractLoader(input.interface)).pipe(
      mergeMap(([txParams, schema]) => {
        const abi = schema.abi.find(isConstructorAbi);
        if (!abi || !schema.bytecode) {
          throw Error(
            `Cannot deploy contract ${input.interface}, missing abi or bytecode`
          );
        }
        return from(
          deployContract(provider, {
            abi,
            args: input.payload,
            bytecode: schema.bytecode,
            txParams
          })
        ).pipe(
          mergeMap(getReceipt(provider)),
          map(x => x.contractAddress!)
        );
      })
    );
  };
}
