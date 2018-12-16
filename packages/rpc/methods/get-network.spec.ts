import { getNetwork } from './get-network';
import { expect } from 'chai';
import { testProvider } from '../mocks';

const network = '1';

describe('Network', () => {
  it('Calls net_version', async () => {
    const provider = testProvider(() => network);

    await getNetwork(provider);

    expect(provider.getOnlyRequest()).to.deep.eq({
      method: 'net_version',
      params: []
    });
  });

  it('Returns network', async () => {
    const provider = testProvider(() => network);

    expect(await getNetwork(provider)).to.deep.eq(network);
  });
});
