import { unsubscribe } from './unsubscribe';
import { expect } from 'chai';
import { testProvider } from '../mocks';

const subscriptionId = '123456';
const address = ['0x123'];

describe('Unsubscribe', () => {
  it('Calls eth_unsubscribe', async () => {
    let provider = testProvider(() => true);

    await unsubscribe(provider, subscriptionId);

    expect(provider.getOnlyRequest()).to.deep.eq({
      method: 'eth_unsubscribe',
      params: [subscriptionId]
    });
  });

  it('Succeed when unsubscription success', async () => {
    let provider = testProvider(() => true);

    expect(await unsubscribe(provider, subscriptionId)).to.deep.eq(true);
  });

  it('Fails when unsubscription failed', async () => {
    let provider = testProvider(() => false);

    await unsubscribe(provider, subscriptionId).then(
      () => {
        throw Error('NOT REJECTED');
      },
      err => expect(err).instanceOf(Error)
    );
  });
});
