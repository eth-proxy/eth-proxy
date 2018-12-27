import { FunctionDescription } from '../interfaces';
import { toSignatureHash, getMethodID } from './signature';
import { expect } from 'chai';

/*
 * https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#examples
 * contract Foo {
 *   function bar(fixed[2] xy) {}
 *   function baz(uint32 x, bool y) returns (bool r) { r = x > 32 || y; }
 *   function sam(bytes name, bool z, uint[] data) {}
 * }
 */

const bazABI: FunctionDescription = {
  name: 'baz',
  type: 'function',
  inputs: [
    {
      name: 'x',
      type: 'uint32'
    },
    {
      name: 'y',
      type: 'bool'
    }
  ],
  outputs: []
};

describe('Signature hash', () => {
  it('baz signature equals precalculated hash', () => {
    const precalculatedHash =
      '0x' + 'cdcd77c0992ec5bbfc459984220f8c45084cc24d9b6efed1fae540db8de801d2';

    expect(toSignatureHash(bazABI)).to.equal(precalculatedHash);
  });

  it('extracts method ID', () => {
    const precalculatedMethodId = '0xcdcd77c0';
    expect(getMethodID(bazABI)).to.equal(precalculatedMethodId);
  });
});
