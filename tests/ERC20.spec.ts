import { at, ethCall } from '@eth-proxy/client';
import { first } from 'rxjs/operators';
import { expect } from 'chai';
import { revert, snapshot } from '@eth-proxy/rpc';
import { deploySampleToken, SampleToken, myToken, ethProxy } from './mocks';

const proxy = ethProxy();
const transferAmount = '1000';
const Recipient = '0xdd6f928583f8c421e5bc8bf4c9376bab98aa22ea';

describe('ERC20', () => {
  beforeEach(() => snapshot(proxy));
  afterEach(async () => {
    await revert(proxy, 1);
    proxy.disconnect();
  });

  it('Can use Sample Token', async () => {
    const { contractAddress } = await deploySampleToken(proxy);

    const MyToken = at(contractAddress!, SampleToken);

    const symbol = await ethCall(proxy, MyToken.symbol());
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

    const balance = await ethCall(proxy, MyToken.balanceOf(Recipient));

    expect(balance.toString()).to.eq(transferAmount);
  });
});
