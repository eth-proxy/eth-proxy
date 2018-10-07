import { getAccounts, getDefaultAccount } from './get-accounts';
import * as sinon from 'sinon';
import { Provider } from '../interfaces';
import { expect } from 'chai';

const rpcResult = result => ({ result });

describe('Accounts', () => {
  let provider: Provider;
  beforeEach(() => {
    provider = {
      sendAsync: () => {}
    } as any;
  });

  it('Calls eth_accounts', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult([])));

    await getAccounts(provider).toPromise();

    expect(sendAsync.firstCall.args[0]).to.deep.eq({
      method: 'eth_accounts',
      params: []
    });
  });

  it('Returns accounts', async () => {
    const accounts = [
      '0xd900e600c54b778d1e16673d8038e74bed6c4a20',
      '0x81ada1d334ac1d9e800d5f4ab34d62de2bc669dd'
    ];
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult(accounts)));

    expect(await getAccounts(provider).toPromise()).to.deep.eq(accounts);
  });
});

describe('Default account', () => {
  let provider: Provider;
  beforeEach(() => {
    provider = {
      sendAsync: () => {}
    } as any;
  });

  it('When multiple accounts returns first', async () => {
    const firstAccount = '0xd900e600c54b778d1e16673d8038e74bed6c4a20';
    const accounts = [
      firstAccount,
      '0x81ada1d334ac1d9e800d5f4ab34d62de2bc669dd'
    ];
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult(accounts)));

    expect(await getDefaultAccount(provider).toPromise()).to.deep.eq(
      firstAccount
    );
  });

  it('When no accounts, returns null', async () => {
    const accounts = [];
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult(accounts)));

    await getAccounts(provider).toPromise();

    expect(await getDefaultAccount(provider).toPromise()).to.be.null;
  });
});
