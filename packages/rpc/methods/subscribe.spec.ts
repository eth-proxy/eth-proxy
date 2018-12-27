import { subscribe } from './subscribe';
import { expect } from 'chai';
import { testProvider } from '../mocks';

const subscriptionId = '123456';
const address = ['0x123'];

describe('Subscribe', () => {
  it('Calls eth_subscribe', async () => {
    const provider = testProvider();

    await subscribe(provider, { type: 'logs', args: { address } });

    expect(provider.getOnlyRequest()).to.deep.eq({
      method: 'eth_subscribe',
      params: ['logs', { address }]
    });
  });

  it('Skipps arguments when not provided', async () => {
    const provider = testProvider();

    await subscribe(provider, { type: 'syncing' });

    expect(provider.getOnlyRequest()).to.deep.eq({
      method: 'eth_subscribe',
      params: ['syncing']
    });
  });

  it('Returns subscriptionId', async () => {
    const provider = testProvider(() => subscriptionId);

    expect(
      await subscribe(provider, { type: 'newPendingTransactions' })
    ).to.deep.eq(subscriptionId);
  });
});
