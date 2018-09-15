import * as Web3 from 'web3';
import { SampleToken } from '../../mocks';
import { sendTransaction } from './send-transaction';
import { expect } from 'chai';
import { FunctionDescription } from '../../interfaces';

interface Payload {
  params: any;
}

const { abi } = SampleToken;
const transferAbi = abi.find(
  x => x.type === 'function' && x.name === 'transfer'
) as FunctionDescription;

const txParams = {
  from: '0x7d76cc1e430ff6f16d184a3e7ee003502a95d4bb',
  to: '0xa7744e243714407cddf93315902306dde53d8fe4',
  gas: 10000
};

const transferTo = '0x8718986382264244252fc4abd0339eb8d5708727';
const value = '1';

describe('Send transaction', () => {
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

    const contract = web3.eth.contract(abi as any).at(txParams.to) as any;

    contract.transfer.sendTransaction(transferTo, value, txParams, () => {});
  });
}

function getRxWeb3Payload() {
  return new Promise<Payload>((res, rej) => {
    const provider = {
      sendAsync: payload => res(payload)
    };

    sendTransaction(provider, {
      abi: transferAbi,
      args: {
        _to: transferTo,
        _value: value
      },
      txParams
    }).subscribe();
  });
}
