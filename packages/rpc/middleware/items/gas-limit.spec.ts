import { gasLimitMiddleware } from './gas-limit';
import * as sinon from 'sinon';
import { EthSendTransactionRequest } from '../../interfaces';
import { of } from 'rxjs';
import { expect } from 'chai';

const _10wei = 10;
const _10WeiInHex = '0xa';

const mockNext = (x: any) => of(x);

describe('gasPriceMiddleware', () => {
  it('sets gas price for transaction', async () => {
    const always10GweiLoader = sinon.stub().returns(of(_10wei));

    const middleware = gasLimitMiddleware(always10GweiLoader);

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
    const alwaysUndefinedGasLoader = sinon.stub().returns(of(undefined));

    const middleware = gasLimitMiddleware(alwaysUndefinedGasLoader);

    const initialTx = {
      method: 'eth_sendTransaction',
      params: [{}]
    } as EthSendTransactionRequest;

    expect(await middleware(initialTx, mockNext).toPromise()).to.deep.eq(
      initialTx
    );
  });
});
