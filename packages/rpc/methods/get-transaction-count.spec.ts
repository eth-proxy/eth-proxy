import { getTransactionCount } from './get-transaction-count';
import { expect } from 'chai';
import { testProvider } from '../mocks';

const account = '0xc94770007dda54cF92009BFF0dE90c06F603a09f';

const txCount = 100;
const txCountInHex = '0x64';

describe('Get transaction count', () => {
  it('Calls eth_getTransactionCount', async () => {
    const atBlock = 500;
    const atBlockHex = '0x1f4';

    const provider = testProvider(() => txCountInHex);

    await getTransactionCount(provider, { account, atBlock });

    expect(provider.getOnlyRequest()).to.deep.eq({
      method: 'eth_getTransactionCount',
      params: [account, atBlockHex]
    });
  });

  it('Defaults block to latest', async () => {
    const provider = testProvider(() => txCountInHex);

    await getTransactionCount(provider, { account });

    expect(provider.getOnlyRequest().params).to.deep.eq([account, 'latest']);
  });

  it('Returns transaction count', async () => {
    const provider = testProvider(() => txCountInHex);

    expect(await getTransactionCount(provider, { account })).to.deep.eq(
      txCount
    );
  });
});
