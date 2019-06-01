import { nonceMiddleware, NonceTracker } from './nonce';
import {
  EthSendTransactionRequest,
  EthAccountsRequest
} from '../../interfaces';
import { of, throwError } from 'rxjs';
import { expect, assert } from 'chai';
import { Dictionary } from 'ramda';

const _nonce = 10;
const _nonceHex = '0xa';
const address = '0x213';
const noncesMap: Dictionary<number> = {
  [address]: _nonce
};

const mockNext = (x: any) => of(x);
const nextError = () => throwError('ERROR');

describe.only('nonceMiddleware', () => {
  it('does not modify not transactions', async () => {
    const middleware = nonceMiddleware({
      up: addr => of(noncesMap[addr]),
      down: addr => of(noncesMap[addr])
    });

    const request = {
      method: 'eth_accounts',
      params: []
    } as EthAccountsRequest;

    expect(await middleware(request, mockNext).toPromise()).to.deep.eq(request);
  });

  it('does not modify payload when nonce is preset', async () => {
    const middleware = nonceMiddleware({
      up: addr => of(noncesMap[addr]),
      down: addr => of(noncesMap[addr])
    });

    const initialTx = {
      method: 'eth_sendTransaction',
      params: [
        {
          nonce: _nonceHex
        }
      ]
    } as EthSendTransactionRequest;

    expect(await middleware(initialTx, mockNext).toPromise()).to.deep.eq(
      initialTx
    );
  });

  it('sets nonce for transaction', async () => {
    const middleware = nonceMiddleware({
      up: addr => of(noncesMap[addr]),
      down: addr => of(noncesMap[addr])
    });

    const initialTx = {
      method: 'eth_sendTransaction',
      params: [
        {
          from: address
        }
      ]
    } as EthSendTransactionRequest;

    const expectedResult = {
      method: 'eth_sendTransaction',
      params: [
        {
          from: address,
          nonce: _nonceHex
        }
      ]
    } as EthSendTransactionRequest;

    expect(await middleware(initialTx, mockNext).toPromise()).to.deep.eq(
      expectedResult
    );
  });

  it('downgrades nonce on error', async () => {
    let downgraded = false;
    const tracker: NonceTracker = {
      up: addr => of(noncesMap[addr]),
      down: addr => {
        downgraded = true;
        return of(noncesMap[addr] - 1);
      }
    };
    const middleware = nonceMiddleware(tracker);

    const initialTx = {
      method: 'eth_sendTransaction',
      params: [
        {
          from: address
        }
      ]
    } as EthSendTransactionRequest;

    try {
      await middleware(initialTx, nextError).toPromise();
    } catch {}

    assert.isTrue(downgraded);
  });
});
