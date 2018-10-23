import { createRxWeb3, Provider } from '@eth-proxy/rx-web3';
import sinon = require('sinon');
import { expect } from 'chai';

const rpcResult = result => ({ result });

describe('rx-web3', () => {
  let providerMock: Provider;
  let sendAsync: sinon.SinonStub;

  beforeEach(() => {
    providerMock = {
      sendAsync: () => {}
    };
    sendAsync = sinon.stub(providerMock, 'sendAsync');
  });

  it('bundles all methods', () => {
    const web3 = createRxWeb3(providerMock);

    web3.getAccounts().subscribe();

    expect(sendAsync.firstCall.args[0].method).to.eq('eth_accounts');
  });

  it('pass parameters', () => {
    const hash = '0x123';
    const web3 = createRxWeb3(providerMock);

    web3.getBlockByHash({ hash }).subscribe();

    expect(sendAsync.firstCall.args[0].params[0]).to.eq(hash);
  });

  it('return result', done => {
    const hash = '0x123';
    const block = { hash } as any;
    const web3 = createRxWeb3(providerMock);
    sendAsync.callsFake((args, cb) => cb(null, rpcResult(block)));

    web3.getBlockByHash({ hash }).subscribe(response => {
      expect(response).to.deep.eq(block);
      done();
    });
  });
});
