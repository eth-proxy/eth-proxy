import { blockNumber } from './block-number';
import { expect } from 'chai';
import { testProvider } from '../mocks';

describe('BlockNumber', () => {
  it('Calls eth_blockNumber', async () => {
    const provider = testProvider(() => '0x0');
    await blockNumber(provider);

    expect(provider.getOnlyRequest()).to.deep.eq({
      method: 'eth_blockNumber',
      params: []
    });
  });

  it('Returns block number', async () => {
    const blockNr = 3220;
    const blockNrHex = '0xc94';

    const provider = testProvider(() => blockNrHex);

    expect(await blockNumber(provider)).to.deep.eq(blockNr);
  });
});
