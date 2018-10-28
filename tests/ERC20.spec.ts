import { createProxy, C, RequestFactory, at } from '@eth-proxy/client';
import { of } from 'rxjs';
import { mergeMap, tap, first, mapTo } from 'rxjs/operators';
import { expect } from 'chai';
import { snapshot, revert } from './utils';
import { Contracts } from './contracts';
import { httpProvider } from '@eth-proxy/rpc';

const proxy = createProxy<Contracts>(httpProvider(), {
  contractSchemaResolver: ({ name }) => import(`./schemas/${name}.json`)
});

const transferAmount = '1000';
const Recipient = '0xdd6f928583f8c421e5bc8bf4c9376bab98aa22ea';

const { SampleToken } = (C as any) as RequestFactory<Contracts>;

const myToken = {
  _name: 'myToken',
  _symbol: 'myTokenSymbol',
  _decimals: 18,
  supply: 10 * 10 ** 18
};

describe('ERC20', () => {
  beforeEach(() => {
    snapshot();
  });
  afterEach(() => {
    proxy.stop();
    revert();
  });

  it('Can use Sample Token', done => {
    proxy
      .deploy({
        interface: 'SampleToken',
        payload: myToken,
        gas: 7000000
      })
      .pipe(
        mergeMap(contractAddress => {
          const MyToken = at(SampleToken, contractAddress);

          return of(null).pipe(
            mapTo(MyToken.symbol()),
            mergeMap(proxy.ethCall),
            tap(symbol => expect(symbol).to.eq(myToken._symbol)),
            mapTo(
              MyToken.transfer({
                _to: Recipient,
                _value: transferAmount
              })
            ),
            mergeMap(proxy.transaction),
            first(x => x.status === 'tx'),
            mapTo(MyToken.balanceOf(Recipient)),
            mergeMap(proxy.ethCall),
            tap(balance => expect(balance.toString()).to.eq(transferAmount))
          );
        })
      )
      .subscribe(() => done());
  });
});
