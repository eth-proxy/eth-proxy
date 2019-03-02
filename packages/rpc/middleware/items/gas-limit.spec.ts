import { gasLimitMiddleware } from './gas-limit';
import { EthSendTransactionRequest } from '../../interfaces';
import { of } from 'rxjs';
import { expect } from 'chai';

const _10wei = 10;
const _10WeiInHex = '0xa';

const mockNext = (x: any) => of(x);

describe('gas limit middleware', () => {
  it('sets gas price for transaction', async () => {
    const middleware = gasLimitMiddleware(() => of(_10wei));

    const initialTx = {
      method: 'eth_sendTransaction',
      params: [{}]
    } as EthSendTransactionRequest;

    const expectedResult = {
      method: 'eth_sendTransaction',
      params: [
        {
          gas: _10WeiInHex
        }
      ]
    } as EthSendTransactionRequest;

    expect(await middleware(initialTx, mockNext).toPromise()).to.deep.eq(
      expectedResult
    );
  });

  it('does not modify payload when gas not provided', async () => {
    const middleware = gasLimitMiddleware(() => of(undefined));

    const initialTx = {
      method: 'eth_sendTransaction',
      params: [{}]
    } as EthSendTransactionRequest;

    expect(await middleware(initialTx, mockNext).toPromise()).to.deep.eq(
      initialTx
    );
  });
});
