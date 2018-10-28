import { getNetwork } from './get-network';
import * as sinon from 'sinon';
import { Provider } from '../interfaces';
import { expect } from 'chai';

const rpcResult = result => ({ result });
const network = '1';

describe('Network', () => {
  let provider: Provider;
  beforeEach(() => {
    provider = {
      sendAsync: () => {}
    } as any;
  });

  it('Calls net_version', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult(network)));

    await getNetwork(provider);

    expect(sendAsync.firstCall.args[0]).to.deep.eq({
      method: 'net_version',
      params: []
    });
  });

  it('Returns network', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult(network)));

    expect(await getNetwork(provider)).to.deep.eq(network);
  });
});
