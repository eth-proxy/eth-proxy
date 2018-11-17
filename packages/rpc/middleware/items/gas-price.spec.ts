import { gasPriceMiddleware, GasPreset } from './gas-price';
import sinon = require('sinon');
import { EthSendTransactionRequest, TransactionParams } from '../../interfaces';
import { of } from 'rxjs';
import { expect } from 'chai';
import { EthUnits } from '../../constants';

const _10Gwei: GasPreset = {
  amount: 10,
  unit: EthUnits.Gwei
};

const _10GweiInWeiInHex = '0x2540be400';

const mockNext = x => of(x);

describe('gasPriceMiddleware', () => {
  it('sets gas price for transaction', async () => {
    var always10GweiLoader = sinon.stub().returns(of(_10Gwei));

    const middleware = gasPriceMiddleware(always10GweiLoader);

    const initialTx = {
      method: 'eth_sendTransaction',
      params: [{}]
    } as EthSendTransactionRequest;

    const expectedResult = {
      method: 'eth_sendTransaction',
      params: [
        {
          gasPrice: _10GweiInWeiInHex
        }
      ]
    } as EthSendTransactionRequest;

    expect(await middleware(initialTx, mockNext).toPromise()).to.deep.eq(
      expectedResult
    );
  });

  it('does not modify payload when gasPrice not provided', async () => {
    var alwaysUndefinedGasLoader = sinon.stub().returns(of(undefined));

    const middleware = gasPriceMiddleware(alwaysUndefinedGasLoader);

    const initialTx = {
      method: 'eth_sendTransaction',
      params: [{}]
    } as EthSendTransactionRequest;

    expect(await middleware(initialTx, mockNext).toPromise()).to.deep.eq(
      initialTx
    );
  });
});
