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
import { httpSubprovider, rpc, Provider } from '@eth-proxy/rpc';

describe('ERC20', () => {
  const {
    snapshot,
    revert,
    watchBlocks,
    mine,
    watchLogs,
    getAccounts,
    sendTransactionWithData,
    getReceipt,
    getLogs
  } = rpc(httpSubprovider());

  beforeEach(snapshot);
  afterEach(revert);

  it('Watches latest block', done => {
    const watch$ = watchBlocks({
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
    const watch$ = watchLogs({
      filter: {
        fromBlock: 0,
        toBlock: 'latest',
        address: null
      }
    }).pipe(first());

    const accounts$ = getAccounts();

    const transfer$ = of(1, 2, 3).pipe(
      mergeMapTo(accounts$),
      mergeMap(([account1, account2]) =>
        sendTransactionWithData({
          from: account1,
          to: account2,
          value: '100',
          data: '0',
          gas: '101000'
        }).then(getReceipt)
      )
    );

    watch$.subscribe(() => {
      done();
    });
    transfer$.subscribe();

    of(null)
      .pipe(
        delay(5000),
        mergeMap(() =>
          getLogs({
            fromBlock: 0,
            toBlock: 'latest',
            address: null
          })
        )
      )
      .subscribe();
  }).timeout(10000);
});
