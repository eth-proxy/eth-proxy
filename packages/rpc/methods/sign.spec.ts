import { sign } from './sign';
import * as sinon from 'sinon';
import { Provider } from '../interfaces';
import { expect } from 'chai';

const rpcResult = result => ({ result });

const data = `I sign this 123`;
const address = '0x123';
const hexData = '0x49207369676e207468697320313233';
const signedMessage = 'Signed message';

describe('Personal sign', () => {
  let provider: Provider;
  beforeEach(() => {
    provider = {
      sendAsync: () => {}
    } as any;
  });

  it('Calls personal_sign', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult(signedMessage)));

    await sign(provider, { address, data }).toPromise();

    expect(sendAsync.firstCall.args[0]).to.deep.eq({
      method: 'personal_sign',
      params: [hexData, address]
    });
  });

  it('Returns signed message', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult(signedMessage)));

    expect(await sign(provider, { address, data }).toPromise()).to.deep.eq(
      signedMessage
    );
  });
});
