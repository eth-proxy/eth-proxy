import { formatArg } from './encoder';
import { expect } from 'chai';
import { BigNumber } from 'bignumber.js';

describe('argument formatting', () => {
  it('format array', () => {
    const stringArray = [1, '2', new BigNumber(3)];
    const expectedStringArray = ['1', '2', '3'];
    expect(formatArg('bytes32[]', stringArray)).to.deep.eq(expectedStringArray);
  });

  it('formats each array argument', () => {
    const stringTuple = [1, '2', new BigNumber(3)];
    const expectedBytesTuple = ['1', '2', '3'];
    expect(formatArg('bytes32[]', stringTuple)).to.deep.eq(expectedBytesTuple);
  });

  it('format tuple', () => {
    const stringTuple = ['a'];
    expect(formatArg('bytes32[1]', stringTuple)).to.deep.eq(stringTuple);
  });

  it('formats each tuple argument', () => {
    const stringTuple = [1, '2', new BigNumber(3)];
    const expectedBytesTuple = ['1', '2', '3'];
    expect(formatArg('bytes32[3]', stringTuple)).to.deep.eq(expectedBytesTuple);
  });
});
