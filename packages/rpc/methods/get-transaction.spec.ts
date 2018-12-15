import { getTransactionByHash } from './get-transaction';
import { RawTransaction, Transaction } from '../interfaces';
import { expect } from 'chai';
import { BigNumber } from 'bignumber.js';
import { testProvider } from '../mocks';

const txHash =
  '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238';

describe('Get transaction', () => {
  it('Calls eth_getTransactionByHash method wit hash', async () => {
    const provider = testProvider(() => txHash);

    await getTransactionByHash(provider, txHash);

    expect(provider.getOnlyRequest()).to.deep.eq({
      method: 'eth_getTransactionByHash',
      params: [txHash]
    });
  });

  it('Throws when transaction is nil', async () => {
    const provider = testProvider(() => null);

    try {
      await getTransactionByHash(provider, txHash);
    } catch (err) {
      expect(err.message).to.eq('Transaction is nil');
    }
  });

  it('Return formatted transaction', async () => {
    const provider = testProvider(() => unformattedTx);
    const result = await getTransactionByHash(provider, txHash);

    expect(result).to.deep.eq(formattedTx);
  });
});

const unformattedTx: RawTransaction = {
  blockHash:
    '0x03fbb45a69bc86744b1f0641cea52e3db02baac37903f3c6b7c928efbbcd5fa2',
  blockNumber: '0x61f639',
  from: '0x9539e0b14021a43cde41d9d45dc34969be9c7cb0',
  gas: '0xea60',
  gasPrice: '0x4a817c800',
  hash: '0x4c706967ff57e91ba5e5193fb4be8bd72c279e9cf44dabc27c21bf51f3f97c11',
  input:
    '0xa9059cbb000000000000000000000000ee57bfc89de77bc2807c26a62997ad2c5722ccfa00000000000000000000000000000000000000000000000000000542484d35c0',
  nonce: '0x2c516',
  r: '0xb580adcb0800ceb487eb9b0aeea050f8105f1fb03b3cf27a95301b23b413af41',
  s: '0x60d257a3960bf86c1d7e28c721ff291d09c0c0130376e56e3a8bffb890091ecf',
  to: '0xb5dbc6d3cf380079df3b27135664b6bcf45d1869',
  transactionIndex: '0x47',
  v: '0x25',
  value: '0x0'
};

const formattedTx: Transaction = {
  blockHash:
    '0x03fbb45a69bc86744b1f0641cea52e3db02baac37903f3c6b7c928efbbcd5fa2',
  blockNumber: 6420025,
  from: '0x9539e0b14021a43cde41d9d45dc34969be9c7cb0',
  gas: 60000,
  gasPrice: new BigNumber('20000000000'),
  hash: '0x4c706967ff57e91ba5e5193fb4be8bd72c279e9cf44dabc27c21bf51f3f97c11',
  input:
    '0xa9059cbb000000000000000000000000ee57bfc89de77bc2807c26a62997ad2c5722ccfa00000000000000000000000000000000000000000000000000000542484d35c0',
  nonce: 181526,
  r: '0xb580adcb0800ceb487eb9b0aeea050f8105f1fb03b3cf27a95301b23b413af41',
  s: '0x60d257a3960bf86c1d7e28c721ff291d09c0c0130376e56e3a8bffb890091ecf',
  to: '0xb5dbc6d3cf380079df3b27135664b6bcf45d1869',
  transactionIndex: 71,
  v: '0x25',
  value: new BigNumber(0)
};
