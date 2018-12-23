import { timer, of, from } from 'rxjs';
import {
  mergeMap,
  first,
  takeUntil,
  bufferCount,
  mergeMapTo
} from 'rxjs/operators';
import { httpSubprovider, createRpc } from '@eth-proxy/rpc';

describe('Watches', () => {
  const {
    snapshot,
    revert,
    watchBlocks,
    mine,
    watchEvents,
    getAccounts,
    sendTransactionWithData
  } = createRpc(httpSubprovider());

  beforeEach(snapshot);
  afterEach(() => revert(1));

  it('Watches latest block', done => {
    const watch$ = watchBlocks({
      timer$: timer(0, 50)
    }).pipe(
      bufferCount(5),
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

  it.skip('Watches events', done => {
    const accounts$ = from(getAccounts());

    const watch$ = watchEvents({
      filter: {
        fromBlock: 0,
        toBlock: 'latest',
        address: null
      }
    }).pipe(first());

    const transfer$ = of(1, 2, 3).pipe(
      mergeMapTo(accounts$),
      mergeMap(([account1, account2]) =>
        sendTransactionWithData({
          from: account1,
          to: account2,
          value: '100',
          data: '0',
          gas: '101000'
        })
      )
    );

    watch$.subscribe(() => {
      done();
    });

    transfer$.subscribe();
  }).timeout(10000);
});
