import { Observable } from 'rxjs';
import { ObservableStore, State } from '../store';
import {
  getContractFromRef,
  createLoadContractSchema
} from '../modules/schema';
import * as fromBlocks from '../modules/blocks';
import { tap, first } from 'rxjs/operators';
import { getLoadedValue, isNotAsked } from '../utils';
import { Block } from '@eth-proxy/rx-web3';

export const createBlockLoader = (store: ObservableStore<State>) => (
  number: number
): Observable<Block> => {
  return store.select(fromBlocks.getBlock(number)).pipe(
    tap(block => {
      if (isNotAsked(block)) {
        store.dispatch(fromBlocks.createLoadBlock(number));
      }
    }),
    getLoadedValue(),
    first()
  );
};
