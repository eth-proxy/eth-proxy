import * as Web3 from 'web3';
import { SampleToken } from '../../mocks';
import { sendCall } from './send-call';
import { expect } from 'chai';
import { FunctionDescription } from '../../interfaces';

interface Payload {
  params: any;
}
const { abi } = SampleToken;
const symbolEthCall = abi.find(
  x => x.type === 'function' && x.name === 'symbol'
) as FunctionDescription;

const txParams = {
  from: '0x7d76cc1e430ff6f16d184a3e7ee003502a95d4bb',
  to: '0xa7744e243714407cddf93315902306dde53d8fe4'
};

describe('Send call', () => {
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

    contract.symbol.call(txParams, () => {});
  });
}

function getRxWeb3Payload() {
  return new Promise<Payload>((res, rej) => {
    const provider = {
      sendAsync: payload => res(payload)
    };

    sendCall(
      {
        abi: symbolEthCall,
        args: undefined,
        txParams
      },
      provider
    ).subscribe();
  });
}
