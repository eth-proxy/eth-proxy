import { timer, of } from 'rxjs';
import {
  mergeMap,
  first,
  takeUntil,
  bufferCount,
  mergeMapTo,
  delay,
  distinctUntilChanged
} from 'rxjs/operators';
import { snapshot, revert, mine } from './utils';
import {
  httpProvider,
  watchBlocks,
  getAccounts,
  getReceipt,
  getLogs,
  watchLogs
} from '@eth-proxy/rx-web3';
import { sendTransactionWithData } from '@eth-proxy/rx-web3/methods/request/send-transaction';

describe('ERC20', () => {
  beforeEach(() => snapshot());
  afterEach(() => revert());

  it('Watches latest block', done => {
    const watch$ = watchBlocks(httpProvider(), {
      timer$: timer(0, 50)
    }).pipe(
      bufferCount(5),
      distinctUntilChanged(),
      first()
    );

    const miner$ = timer(0, 100).pipe(
      mergeMap(mine),
      takeUntil(watch$)
    );

    watch$.subscribe(() => {
      done();
    });
    miner$.subscribe();
  });

  it('Watches events', done => {
    const watch$ = watchLogs(httpProvider(), {
      filter: {
        fromBlock: 0,
        toBlock: 'latest',
        address: null
      }
    }).pipe(first());

    const accounts$ = getAccounts(httpProvider());

    const transfer$ = of(1, 2, 3).pipe(
      mergeMapTo(accounts$),
      mergeMap(([account1, account2]) =>
        sendTransactionWithData(httpProvider(), {
          from: account1,
          to: account2,
          value: '100',
          data: '0',
          gas: '101000'
        }).pipe(mergeMap(x => getReceipt(httpProvider(), x)))
      )
    );

    watch$.subscribe(logs => {
      console.log('logs', logs);
      done();
    });
    transfer$.subscribe();

    of(null)
      .pipe(
        delay(5000),
        mergeMap(() => {
          return getLogs(httpProvider(), {
            fromBlock: 0,
            toBlock: 'latest',
            address: null
          });
        })
      )
      .subscribe(console.log);
  }).timeout(10000);
});
