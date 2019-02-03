import { combineLatest, from } from 'rxjs';

import { Context } from '../context';
import { mergeMap, map, first } from 'rxjs/operators';
import { isConstructorAbi, deployContract, getReceipt } from '@eth-proxy/rpc';
import * as fromTx from '../modules/transaction';
import * as fromAccount from '../modules/account';

/* 
  Only sutiable for testrpc
*/
export function deploy({ store, contractLoader, provider }: Context) {
  return (input: fromTx.DeploymentInput<string, any>) => {
    const txParams$ = store.select(fromAccount.getActiveAccount).pipe(
      map(account => {
        return fromTx.mergeParams(input, { from: account });
      }),
      first(fromTx.txParamsValid)
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
