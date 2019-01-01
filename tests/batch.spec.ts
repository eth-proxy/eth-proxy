import {
  batch,
  httpSubprovider,
  createRpc,
  getBlockByNumberReq,
  getLogsReq
} from '@eth-proxy/rpc';
import { assert } from 'chai';

describe('Batches', () => {
  const { snapshot, revert } = createRpc(httpSubprovider());

  beforeEach(snapshot);
  afterEach(() => revert(1));

  it('Batches multiple requests', async () => {
    const [block, logs] = await batch(httpSubprovider(), [
      getBlockByNumberReq({ number: 'latest' }),
      getLogsReq({ fromBlock: 0, toBlock: 0 })
    ]);

    assert.deepEqual(block.number, 0);
    assert.deepEqual(logs, []);
  });
});
