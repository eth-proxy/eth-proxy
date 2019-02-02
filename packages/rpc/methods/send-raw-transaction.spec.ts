import { sendRawTransaction } from './send-raw-transaction';
import { expect } from 'chai';
import { testProvider } from '../mocks';

const signedTx = '0xd46e8dd67c5d32be8d46';
const txHash = '0xe670ec64341';

describe('Send raw transaction', () => {
  it('Calls eth_sendRawTransaction', async () => {
    const provider = testProvider();
    await sendRawTransaction(provider, signedTx);

    expect(provider.getOnlyRequest()).to.deep.eq({
      method: 'eth_sendRawTransaction',
      params: [signedTx]
    });
  });

  it('Returns txHash', async () => {
    const provider = testProvider(() => txHash);

    expect(await sendRawTransaction(provider, signedTx)).to.deep.eq(txHash);
  });
});
