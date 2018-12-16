import { getBalance } from './get-balance';
import { expect } from 'chai';
import { BigNumber } from 'bignumber.js';
import { testProvider } from '../mocks';

const rpcResult = result => ({ result });

const account = '0xc94770007dda54cF92009BFF0dE90c06F603a09f';

const balance100 = new BigNumber(100);
const balance100InHex = '0x64';

describe('Balance', () => {
  it('Calls eth_getBalance', async () => {
    const provider = testProvider(() => balance100InHex);

    await getBalance(provider, { account });

    expect(provider.getOnlyRequest()).to.deep.eq({
      method: 'eth_getBalance',
      params: [account, 'latest']
    });
  });

  it('Returns balance', async () => {
    const provider = testProvider(() => balance100InHex);

    expect(await getBalance(provider, { account })).to.deep.eq(balance100);
  });
});
