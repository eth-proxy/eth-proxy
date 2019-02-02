const Web3 = require('web3');
import { SampleToken, testProvider, expectRequestsEq } from '../../mocks';
import { sendCall } from './send-call';
import { FunctionDescription, RpcRequest } from '../../interfaces';
import { assert } from 'chai';

const { abi } = SampleToken;
const symbolEthCall = abi.find(
  x => x.type === 'function' && x.name === 'symbol'
) as FunctionDescription;

const txParams = {
  from: '0x7d76cc1e430ff6f16d184a3e7ee003502a95d4bb',
  to: '0xa7744e243714407cddf93315902306dde53d8fe4'
};
const blockNr = 3220;

describe('Send call', () => {
  it('generates same payload as web3 client', async () => {
    const provider = testProvider(() => '');

    sendCall(provider, {
      abi: symbolEthCall,
      args: undefined,
      txParams,
      atBlock: blockNr
    });

    expectRequestsEq(provider.getOnlyRequest(), await getWeb3Payload());
  });

  it('defaults atBlock to latest', async () => {
    const provider = testProvider(() => '');

    sendCall(provider, {
      abi: symbolEthCall,
      args: undefined,
      txParams
    });
    const {
      params: [, atBlock]
    } = provider.getOnlyRequest();

    assert.deepEqual(atBlock, 'latest');
  });
});

// Each time returns different data
function getWeb3Payload() {
  return new Promise<RpcRequest>(res => {
    const web3 = new Web3({
      sendAsync: (payload: any) => res(payload)
    });

    const contract = web3.eth.contract(abi as any).at(txParams.to) as any;

    contract.symbol.call(txParams, blockNr, () => {});
  });
}
