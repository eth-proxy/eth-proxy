const Web3 = require('web3');
import { SampleToken, testProvider, expectRequestsEq } from '../../mocks';
import { estimateGas } from './estimate-gas';
import { FunctionDescription, RpcRequest } from '../../interfaces';

const { abi } = SampleToken;
const symbolAbi = abi.find(
  x => x.type === 'function' && x.name === 'symbol'
) as FunctionDescription;

const txParams = {
  from: '0x7d76cc1e430ff6f16d184a3e7ee003502a95d4bb',
  to: '0xa7744e243714407cddf93315902306dde53d8fe4'
};

describe('Estimate gas', () => {
  it('generates same payload as web3 client', async () => {
    const provider = testProvider(() => '0x0');

    estimateGas(provider, {
      abi: symbolAbi,
      args: undefined,
      txParams
    });

    expectRequestsEq(provider.getOnlyRequest(), await getWeb3Payload());
  });
});

function getWeb3Payload() {
  return new Promise<RpcRequest>(res => {
    const web3 = new Web3({
      sendAsync: (payload: any) => res(payload)
    });

    const contract = web3.eth.contract(abi as any).at(txParams.to) as any;

    contract.symbol.estimateGas(txParams, () => {});
  });
}
