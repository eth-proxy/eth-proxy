import { getBlockByNumber, getBlockByHash } from './get-block';
import * as sinon from 'sinon';
import { Provider, Block, RawBlock } from '../interfaces';
import { expect } from 'chai';
import { BigNumber } from 'bignumber.js';

const rpcResult = <T>(result) => ({ result });

const block100 = 100;
const block100Hash = '0x123';
const block100Hex = '0x64';

describe('Get block by number', () => {
  let provider: Provider;
  beforeEach(() => {
    provider = {
      sendAsync: () => {}
    } as any;
  });

  it('Calls eth_getBlockByNumber method with number', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult({})));

    await getBlockByNumber(provider, { number: block100 });

    expect(sendAsync.firstCall.args[0]).to.deep.eq({
      method: 'eth_getBlockByNumber',
      params: [block100Hex, false]
    });
  });

  it('Calls eth_getBlockByNumber method with tag', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult({})));

    await getBlockByNumber(provider, { number: 'latest' });

    expect(sendAsync.firstCall.args[0]).to.deep.eq({
      method: 'eth_getBlockByNumber',
      params: ['latest', false]
    });
  });

  it('Throws when block is nil', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult(null)));

    try {
      await getBlockByNumber(provider, { number: block100 });
    } catch (err) {
      expect(err.message).to.eq('Invalid block');
    }
  });

  it('Return formatted block', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((_, cb) => cb(null, rpcResult(unformattedBlock)));
    const result = await getBlockByNumber(provider, {
      number: block100
    });

    expect(result).to.deep.eq(formattedBlock);
  });
});

describe('Get block by Hash', () => {
  let provider: Provider;
  beforeEach(() => {
    provider = {
      sendAsync: () => {}
    } as any;
  });

  it('Calls eth_getBlockByHash method', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult({})));

    await getBlockByHash(provider, { hash: block100Hex });

    expect(sendAsync.firstCall.args[0]).to.deep.eq({
      method: 'eth_getBlockByHash',
      params: [block100Hex, false]
    });
  });

  it('Throws when block is nil', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((args, cb) => cb(null, rpcResult(null)));

    try {
      await getBlockByHash(provider, { hash: block100Hex });
    } catch (err) {
      expect(err.message).to.eq('Invalid block');
    }
  });

  it('Return formatted block', async () => {
    const sendAsync = sinon.stub(provider, 'sendAsync');
    sendAsync.callsFake((_, cb) => cb(null, rpcResult(unformattedBlock)));
    const result = await getBlockByHash(provider, {
      hash: block100Hash
    });

    expect(result).to.deep.eq(formattedBlock);
  });
});

const formattedBlock: Block = {
  difficulty: new BigNumber('3223641347048622'),
  extraData: '0x6e616e6f706f6f6c2e6f7267',
  gasLimit: 7992222,
  gasUsed: 7985794,
  hash: '0x393d710589b38a3bfcbe99126885fac855e65a8d45768aac32c3fc1b6a8f49f6',
  logsBloom: '0x',
  miner: '0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5',
  mixHash: '0xfdb6a2b738c8f826a02ad98ac5344d06c5078644c9c4e409ba0908944f54b311',
  nonce: '0xe00a4bf8099ae066',
  number: 6419658,
  parentHash:
    '0x2bbabb57be8257e6d45efb1f8bbfc03a859dca7a47c9bb83b6a31c6938f4a897',
  receiptsRoot:
    '0xe4b3e51811e5b958296ff1bceab9f2ac2601805fa7afec049195191268c9d47d',
  sha3Uncles:
    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
  size: 39911,
  stateRoot:
    '0x55c84be1c18e61830c998ca40572ec568f4fb08e0c601c2d0c22206919316549',
  timestamp: 1538202155,
  totalDifficulty: new BigNumber('6912042690271554791976'),
  transactions: [
    '0x393d710589b38a3bfcbe99126885fac855e65a8d45768aac32c3fc1b6a8f49f6'
  ],
  transactionsRoot:
    '0xd78fbd50943193bb5809ef9b7b1c54a1406e8130e46b0164e76ecef3c0e3f1c5',
  uncles: []
};

const unformattedBlock: RawBlock = {
  difficulty: '0xb73e27d5fc4ae',
  extraData: '0x6e616e6f706f6f6c2e6f7267',
  gasLimit: '0x79f39e',
  gasUsed: '0x79da82',
  hash: '0x393d710589b38a3bfcbe99126885fac855e65a8d45768aac32c3fc1b6a8f49f6',
  logsBloom: '0x',
  miner: '0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5',
  mixHash: '0xfdb6a2b738c8f826a02ad98ac5344d06c5078644c9c4e409ba0908944f54b311',
  nonce: '0xe00a4bf8099ae066',
  number: '0x61f4ca',
  parentHash:
    '0x2bbabb57be8257e6d45efb1f8bbfc03a859dca7a47c9bb83b6a31c6938f4a897',
  receiptsRoot:
    '0xe4b3e51811e5b958296ff1bceab9f2ac2601805fa7afec049195191268c9d47d',
  sha3Uncles:
    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
  size: '0x9be7',
  stateRoot:
    '0x55c84be1c18e61830c998ca40572ec568f4fb08e0c601c2d0c22206919316549',
  timestamp: '0x5baf1a2b',
  totalDifficulty: '0x176b3dc9d3af3636a28',
  transactions: [
    '0x393d710589b38a3bfcbe99126885fac855e65a8d45768aac32c3fc1b6a8f49f6'
  ],
  transactionsRoot:
    '0xd78fbd50943193bb5809ef9b7b1c54a1406e8130e46b0164e76ecef3c0e3f1c5',
  uncles: []
};
