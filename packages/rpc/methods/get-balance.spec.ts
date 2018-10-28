import { getBalance } from './get-balance';
import * as sinon from 'sinon';
import { Provider } from '../interfaces';
import { expect } from 'chai';
import { BigNumber } from 'bignumber.js';

const rpcResult = result => ({ result });

const account = '0xc94770007dda54cF92009BFF0dE90c06F603a09f';

const balance100 = new BigNumber(100);
const balance100InHex = '0x64';

describe('Accounts', () => {
  let provider: Provider;
  beforeEach(() => {
    provider = {
      sendAsync: () => {}
    } as any;
  });

  it('Calls eth_getBalance', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult(balance100InHex)));

    await getBalance(provider, { account }).toPromise();

    expect(sendAsync.firstCall.args[0]).to.deep.eq({
      method: 'eth_getBalance',
      params: [account, 'latest']
    });
  });

  it('Returns balance', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult(balance100InHex)));

    expect(await getBalance(provider, { account }).toPromise()).to.deep.eq(
      balance100
    );
  });
});
