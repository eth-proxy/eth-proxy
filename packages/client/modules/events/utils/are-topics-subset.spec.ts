import { areTopicsSubset } from './are-topics-subset';
import { expect } from 'chai';

describe('Are topics subset', () => {
  it('different sized topics cannot be a subset', () => {
    expect(areTopicsSubset([['2']], [['2'], []])).to.be.false;
  });

  it('when different topics then is not subset', () => {
    expect(areTopicsSubset([['2']], [['1']])).to.be.false;
  });

  it('when equal topics then are subset', () => {
    const topics = [['1', '2', '3'], [], ['A']];
    expect(areTopicsSubset(topics, topics)).to.be.true;
  });

  it('when less parameter of the same topics then is subset', () => {
    expect(areTopicsSubset([['1', '2', '3']], [['1', '2']])).to.be.true;
  });

  it('when parameter is missing its not a subset', () => {
    expect(areTopicsSubset([['1', '2']], [['1', '2', '3']])).to.be.false;
  });

  it('when wildcard topic is used, parametrized topic is not filling it', () => {
    expect(areTopicsSubset([['1', '2'], ['A']], [['1', '2', '3'], []])).to.be
      .false;
  });

  it('when wildcard topic is used, wildcard topic is filling it', () => {
    expect(areTopicsSubset([['1'], []], [['1'], []])).to.be.true;
  });
});
