import { getReceipt } from './get-receipt';
import * as sinon from 'sinon';
import {
  Provider,
  RawTransactionReceipt,
  TransactionReceipt,
  TransactionStatus
} from '../interfaces';
import { expect } from 'chai';

const rpcResult = <T>(result) => ({ result });

const txHash =
  '0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238';

describe('Get receipt', () => {
  let provider: Provider;
  beforeEach(() => {
    provider = {
      sendAsync: () => {}
    } as any;
  });

  it('Calls eth_getTransactionReceipt method wit hash', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult({})));

    await getReceipt(provider, txHash).toPromise();

    expect(sendAsync.firstCall.args[0]).to.deep.eq({
      method: 'eth_getTransactionReceipt',
      params: [txHash]
    });
  });

  it('Return null when no result', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult(null)));

    const result = await getReceipt(provider, txHash).toPromise();
    expect(result).to.be.null;
  });

  it('Return formatted receipt', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((_, cb) => cb(null, rpcResult(unformattedReceipt)));
    const result = await getReceipt(provider, txHash).toPromise();

    expect(result).to.deep.eq(formattedReceipt);
  });
});

const unformattedReceipt: RawTransactionReceipt = {
  blockHash:
    '0x03fbb45a69bc86744b1f0641cea52e3db02baac37903f3c6b7c928efbbcd5fa2',
  blockNumber: '0x61f639',
  contractAddress: null,
  cumulativeGasUsed: '0x632571',
  from: '0x9539e0b14021a43cde41d9d45dc34969be9c7cb0',
  gasUsed: '0xcc3e',
  logs: [
    {
      address: '0xb5dbc6d3cf380079df3b27135664b6bcf45d1869',
      blockHash:
        '0x03fbb45a69bc86744b1f0641cea52e3db02baac37903f3c6b7c928efbbcd5fa2',
      blockNumber: '0x61f639',
      data:
        '0x00000000000000000000000000000000000000000000000000000542484d35c0',
      logIndex: '0x13',
      removed: false,
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      ],
      transactionHash:
        '0x4c706967ff57e91ba5e5193fb4be8bd72c279e9cf44dabc27c21bf51f3f97c11',
      transactionIndex: '0x47'
    }
  ],
  logsBloom: '0x123',
  status: '0x1',
  to: '0xb5dbc6d3cf380079df3b27135664b6bcf45d1869',
  transactionHash:
    '0x4c706967ff57e91ba5e5193fb4be8bd72c279e9cf44dabc27c21bf51f3f97c11',
  transactionIndex: '0x47'
};

const formattedReceipt: TransactionReceipt = {
  blockHash:
    '0x03fbb45a69bc86744b1f0641cea52e3db02baac37903f3c6b7c928efbbcd5fa2',
  blockNumber: 6420025,
  contractAddress: null,
  cumulativeGasUsed: 6497649,
  from: '0x9539e0b14021a43cde41d9d45dc34969be9c7cb0',
  gasUsed: 52286,
  logs: [
    {
      address: '0xb5dbc6d3cf380079df3b27135664b6bcf45d1869',
      blockHash:
        '0x03fbb45a69bc86744b1f0641cea52e3db02baac37903f3c6b7c928efbbcd5fa2',
      blockNumber: 6420025,
      data:
        '0x00000000000000000000000000000000000000000000000000000542484d35c0',
      logIndex: 19,
      removed: false,
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      ],
      transactionHash:
        '0x4c706967ff57e91ba5e5193fb4be8bd72c279e9cf44dabc27c21bf51f3f97c11',
      transactionIndex: 71
    }
  ],
  logsBloom: '0x123',
  status: TransactionStatus.Success,
  to: '0xb5dbc6d3cf380079df3b27135664b6bcf45d1869',
  transactionHash:
    '0x4c706967ff57e91ba5e5193fb4be8bd72c279e9cf44dabc27c21bf51f3f97c11',
  transactionIndex: 71
};
