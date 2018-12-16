import { sign } from './sign';
import { expect } from 'chai';
import { testProvider } from '../mocks';

const data = `I sign this 123`;
const address = '0x123';
const hexData = '0x49207369676e207468697320313233';
const signedMessage = 'Signed message';

describe('Personal sign', () => {
  it('Calls personal_sign', async () => {
    let provider = testProvider();

    await sign(provider, { address, data });

    expect(provider.getOnlyRequest()).to.deep.eq({
      method: 'personal_sign',
      params: [hexData, address]
    });
  });

  it('Returns signed message', async () => {
    let provider = testProvider(() => signedMessage);

    expect(await sign(provider, { address, data })).to.deep.eq(signedMessage);
  });
});
