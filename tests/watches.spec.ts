import { timer, combineLatest } from 'rxjs';
import { mergeMap, first, takeUntil, bufferCount } from 'rxjs/operators';
import { httpSubprovider, createRpc } from '@eth-proxy/rpc';
import { ethProxy, deploySampleToken, SampleToken } from './mocks';
import { at } from '@eth-proxy/client';

const proxy = ethProxy();

describe('Watches', () => {
  const {
    snapshot,
    revert,
    watchBlocks,
    mine,
    watchEvents,
    getAccounts
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

  it('Watches events', done => {
    const watch$ = watchEvents({
      filter: {
        fromBlock: 0,
        toBlock: 'latest',
        address: null
      }
    }).pipe(first());

    const transfer$ = combineLatest(
      deploySampleToken(proxy),
      getAccounts()
    ).pipe(
      mergeMap(([addr, [account1]]) =>
        proxy
          .transaction(
            at(SampleToken, addr).transfer({
              _to: account1,
              _value: 1
            })
          )
          .pipe(first(x => x.status === 'tx'))
      )
    );

    watch$.subscribe(() => {
      done();
    });

    transfer$.subscribe();
  }).timeout(10000);
});
