import { createProxy, at } from '@eth-proxy/client';
import { of } from 'rxjs';
import { mergeMap, tap, first, mapTo } from 'rxjs/operators';
import { expect } from 'chai';
import { Contracts } from './contracts';
import { httpSubprovider, revert, snapshot } from '@eth-proxy/rpc';
import { deploySampleToken, SampleToken, myToken } from './mocks';

const proxy = createProxy<Contracts>(httpSubprovider(), {
  contractSchemaResolver: ({ name }) => import(`./schemas/${name}.json`)
});

const transferAmount = '1000';
const Recipient = '0xdd6f928583f8c421e5bc8bf4c9376bab98aa22ea';

describe('ERC20', () => {
  beforeEach(() => snapshot(proxy));
  afterEach(async () => {
    await revert(proxy, 1);
    proxy.disconnect();
  });

  it('Can use Sample Token', async () => {
    const contractAddress = await deploySampleToken(proxy).toPromise();

    const MyToken = at(SampleToken, contractAddress);

    const symbol = await proxy.ethCall(MyToken.symbol()).toPromise();
    expect(symbol).to.eq(myToken._symbol);

    await proxy
      .transaction(
        MyToken.transfer({
          _to: Recipient,
          _value: transferAmount
        })
      )
      .pipe(first(x => x.status === 'tx'))
      .toPromise();

    const balance = await proxy
      .ethCall(MyToken.balanceOf(Recipient))
      .toPromise();

    expect(balance.toString()).to.eq(transferAmount);
  });
});
