import { convert } from './units';
import { EthUnits } from '../constants';
import { expect } from 'chai';

const _22Gwei = '22';
const _22GweiInWei = '22000000000';

describe('converts units', () => {
  it('converts gwei to wei', () => {
    const converter = convert({
      from: EthUnits.Gwei,
      to: EthUnits.Wei
    });

    expect(converter(_22Gwei).toString()).to.eq(_22GweiInWei);
  });

  it('converts wei to gwei', () => {
    const converter = convert({
      from: EthUnits.Wei,
      to: EthUnits.Gwei
    });

    expect(converter(_22GweiInWei).toString()).to.eq(_22Gwei);
  });
});
