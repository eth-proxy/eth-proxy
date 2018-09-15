import * as Web3 from 'web3';
import {
  createProxy,
  ContractSchema,
  C,
  RequestFactory,
  at
} from '@eth-proxy/client';
import { of } from 'rxjs';
import * as SampleTokenSchema from './schemas/SampleToken.json';
import { mergeMap, tap, first, mapTo } from 'rxjs/operators';
import { expect } from 'chai';
import { snapshot, revert } from './utils';
import { Contracts } from './contracts';
import { isConstructorAbi, httpProvider } from '@eth-proxy/rx-web3';

const proxy = createProxy<Contracts>(of(httpProvider()), {
  contractSchemaResolver: ({ name }) => import(`./schemas/${name}.json`)
});

const transferAmount = '1000';
const Recipient = '0xdd6f928583f8c421e5bc8bf4c9376bab98aa22ea';

const { SampleToken } = (C as any) as RequestFactory<Contracts>;
const schema = SampleTokenSchema as ContractSchema;
const constructorAbi = schema.abi.find(isConstructorAbi);

const myToken = {
  _name: 'myToken',
  _symbol: 'myTokenSymbol',
  _decimals: 18,
  supply: 10 * 10 ** 18
};

describe('ERC20', () => {
  beforeEach(snapshot);
  afterEach(revert);

  it('Can use Sample Token', done => {
    proxy.defaultAccount$
      .pipe(
        mergeMap(from => {
          return proxy
            .deployContract({
              abi: constructorAbi,
              args: myToken,
              bytecode: schema.bytecode,
              txParams: {
                gas: 7000000,
                from
              }
            })
            .pipe(
              mergeMap(proxy.getReceipt),
              mergeMap(({ contractAddress }) => {
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
                  tap(balance =>
                    expect(balance.toString()).to.eq(transferAmount)
                  )
                );
              })
            );
        })
      )
      .subscribe(() => done());
  });
});
