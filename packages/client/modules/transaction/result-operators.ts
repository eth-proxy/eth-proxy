import { Observable } from 'rxjs/Observable';
import { map, filter } from 'rxjs/operators';

import { Transaction, TransactionConfirmation } from './model';

export type PendingStatus = 'init' | 'tx';
const pendingStatuses = ['init', 'tx'];

export function once(type: PendingStatus, fn: (arg: any) => any) {
  return (obs: Observable<Transaction>) =>
    obs.pipe(
      map(next => {
        if (!next || type !== next.status) {
          return next;
        }

        switch (next.status) {
          case 'init':
            return fn(next);
          case 'tx':
            return fn(next.tx);
          default:
            next;
        }
      })
    );
}

export function on(
  type: 'confirmation',
  fn: (confirmation: TransactionConfirmation<any>) => any
) {
  return (obs: Observable<any>) =>
    obs.pipe(
      filter(next => {
        return !(next && pendingStatuses.includes(next.status));
      }),
      map(next => {
        return next.status === 'confirmed' ? fn(next) : next;
      })
    );
}
