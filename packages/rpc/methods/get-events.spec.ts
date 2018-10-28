import { getEvents } from './get-events';
import * as sinon from 'sinon';
import { Provider, FilterObject, RawLog, Log } from '../interfaces';
import { expect } from 'chai';

const rpcResult = <T>(result) => ({ result });

const address = '0x123';
const block100 = 100;
const block100Hex = '0x64';
const topics = ['0x12', ['0x555', '0x222'], []];

describe('Get logs', () => {
  let provider: Provider;
  beforeEach(() => {
    provider = {
      sendAsync: () => {}
    } as any;
  });

  it('Calls eth_getLogs method with formatted input', async () => {
    const filter: FilterObject = {
      address,
      fromBlock: block100,
      toBlock: block100,
      topics
    };
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult([])));

    await getEvents(provider, filter);

    expect(sendAsync.firstCall.args[0]).to.deep.eq({
      method: 'eth_getLogs',
      params: [
        {
          address,
          fromBlock: block100Hex,
          toBlock: block100Hex,
          topics
        }
      ]
    });
  });

  it('Return formatted logs', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((_, cb) => cb(null, rpcResult([unformattedLog])));
    const result = await getEvents(provider, {});

    expect(result).to.deep.eq([formattedLog]);
  });
});

const unformattedLog: RawLog = {
  address: '0x264dc2dedcdcbb897561a57cba5085ca416fb7b4',
  blockHash:
    '0xa52179f78b4790e0adb659b71aa2ab5bcad16b60a0cb9506c20ee7e75c8a5f7c',
  blockNumber: '0x620c64',
  data: '0x0000000000000000000000000000000000000000000011ffdbf6b2b2eb1fffff',
  logIndex: '0x0',
  removed: false,
  topics: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x0000000000000000000000002f8cf3acf9abdd3a1664139b8e5aa95c542db644',
    '0x0000000000000000000000006cc5f688a315f3dc28a7781717a9a798a59fda7b'
  ],
  transactionHash:
    '0x61313506b5e3de2c441133b487993295295e2206f513e4a41764104b51544d88',
  transactionIndex: '0x1'
};

const formattedLog: Log = {
  address: '0x264dc2dedcdcbb897561a57cba5085ca416fb7b4',
  blockHash:
    '0xa52179f78b4790e0adb659b71aa2ab5bcad16b60a0cb9506c20ee7e75c8a5f7c',
  blockNumber: 6425700,
  data: '0x0000000000000000000000000000000000000000000011ffdbf6b2b2eb1fffff',
  logIndex: 0,
  removed: false,
  topics: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x0000000000000000000000002f8cf3acf9abdd3a1664139b8e5aa95c542db644',
    '0x0000000000000000000000006cc5f688a315f3dc28a7781717a9a798a59fda7b'
  ],
  transactionHash:
    '0x61313506b5e3de2c441133b487993295295e2206f513e4a41764104b51544d88',
  transactionIndex: 1
};
