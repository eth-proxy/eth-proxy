import { defaultAccountMiddleware } from './default-account';
import { EthSendTransactionRequest } from '../../interfaces';
import { of, throwError } from 'rxjs';
import { expect } from 'chai';

const defaultAccount = '0x7d76CC1e430fF6F16d184a3E7ee003502A95d4bB';

const mockNext = (x: any) => of(x);

describe('gasPriceMiddleware', () => {
  it('sets gas price for transaction', async () => {
    const middleware = defaultAccountMiddleware(() => of(defaultAccount));

    const initialTx = {
      method: 'eth_sendTransaction',
      params: [{}]
    } as EthSendTransactionRequest;

    const expectedResult = {
      method: 'eth_sendTransaction',
      params: [
        {
          from: defaultAccount
        }
      ]
    } as EthSendTransactionRequest;

    expect(await middleware(initialTx, mockNext).toPromise()).to.deep.eq(
      expectedResult
    );
  });

  it('throws when cannot get account', async () => {
    const err = Error('Cannot load account');
    const middleware = defaultAccountMiddleware(() => throwError(err));

    const initialTx = {
      method: 'eth_sendTransaction',
      params: [{}]
    } as EthSendTransactionRequest;

    try {
      await middleware(initialTx, mockNext).toPromise();
      throw Error('Should throw');
    } catch (e) {
      expect(e).to.eq(err);
    }
  });
});
