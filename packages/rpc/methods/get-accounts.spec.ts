import { getAccounts, getDefaultAccount } from './get-accounts';
import { expect } from 'chai';
import { testProvider } from '../mocks';

describe('Accounts', () => {
  it('Calls eth_accounts', async () => {
    const provider = testProvider();
    await getAccounts(provider);

    expect(provider.getOnlyRequest()).to.deep.eq({
      method: 'eth_accounts',
      params: []
    });
  });

  it('Returns accounts', async () => {
    const accounts = [
      '0xd900e600c54b778d1e16673d8038e74bed6c4a20',
      '0x81ada1d334ac1d9e800d5f4ab34d62de2bc669dd'
    ];
    const provider = testProvider(() => accounts);

    expect(await getAccounts(provider)).to.deep.eq(accounts);
  });
});

describe('Default account', () => {
  it('When multiple accounts returns first', async () => {
    const firstAccount = '0xd900e600c54b778d1e16673d8038e74bed6c4a20';
    const accounts = [
      firstAccount,
      '0x81ada1d334ac1d9e800d5f4ab34d62de2bc669dd'
    ];
    const provider = testProvider(() => accounts);

    expect(await getDefaultAccount(provider)).to.deep.eq(firstAccount);
  });

  it('When no accounts, returns null', async () => {
    const accounts = [];
    const provider = testProvider(() => accounts);

    expect(await getDefaultAccount(provider)).to.be.null;
  });
});
