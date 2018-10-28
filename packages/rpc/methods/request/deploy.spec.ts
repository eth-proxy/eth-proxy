import * as Web3 from 'web3';
import { SampleToken } from '../../mocks';
import { deployContract } from './deploy';
import { expect } from 'chai';
import { isConstructorAbi } from '@eth-proxy/rpc';

const { abi, bytecode } = SampleToken;

const myToken = {
  _name: 'myToken',
  _symbol: 'myTokenSymbol',
  _decimals: 18,
  supply: 10 * 10 ** 18
};

const txParams = {
  data: bytecode,
  from: '0x7d76cc1e430ff6f16d184a3e7ee003502a95d4bb',
  gas: 1000000
};

interface Payload {
  params: any;
}

describe('Deploy', () => {
  it('generates same payload as web3 client', async () => {
    const rxWeb3Payload = await getRxWeb3Payload();
    const web3Payload = await getWeb3Payload();
    expect(rxWeb3Payload.params).to.deep.eq(web3Payload.params);
  });
});

// Each time returns different data
function getWeb3Payload() {
  return new Promise<Payload>((res, rej) => {
    const web3 = new Web3({
      sendAsync: payload => res(payload)
    });

    web3.eth
      .contract(abi as any)
      .new(
        myToken._name,
        myToken._symbol,
        myToken._decimals,
        myToken.supply,
        txParams,
        () => {}
      );
  });
}

function getRxWeb3Payload() {
  return new Promise<Payload>((res, rej) => {
    const provider = {
      sendAsync: payload => res(payload)
    };

    deployContract(provider, {
      abi: abi.find(isConstructorAbi),
      bytecode,
      txParams,
      args: myToken
    });
  });
}
