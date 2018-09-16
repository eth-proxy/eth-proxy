import { web3 } from './common';
import { expect } from 'chai';
import { sha3 } from './sha3';

describe('sha3', () => {
  it('works the same as web3', () => {
    const signature = 'baz(uint32,bool)';
    expect(web3.sha3(signature)).to.eq(sha3(signature));
  });

  it('precalculated hash equals', () => {
    const signature = 'baz(uint32,bool)';
    expect(web3.sha3(signature)).to.eq(
      '0xcdcd77c0992ec5bbfc459984220f8c45084cc24d9b6efed1fae540db8de801d2'
    );
  });
});
