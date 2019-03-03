import { Observable } from 'rxjs';
import { State } from './model';
import { map as rxMap, tap } from 'rxjs/operators';
import * as fromTransactions from '../modules/transaction';

export const getTransactionResultFromInitId$ = (id: string) => (
  state$: Observable<State>
) =>
  state$.pipe(
    rxMap(fromTransactions.getTransactionFromInitId(id)),
    tap(x => {
      if (x && x.status === 'failed') {
        throw x.error;
      }
    })
  );
