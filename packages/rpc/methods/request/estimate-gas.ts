import { curry } from 'ramda';
import { send, ethHexToBN } from '../../utils';
import { Provider, RequestInputParams } from '../../interfaces';
import { toRequestInput } from '../../converters';
import { toRequestData, MethodInput } from './utils';

export interface EstimateGasInput<T = any> extends MethodInput<T> {
  txParams: RequestInputParams;
}

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_estimategas
 */
export const estimateGas = curry(
  (provider: Provider, input: EstimateGasInput): Promise<any> => {
    return send(provider)({
      method: 'eth_estimateGas',
      params: [
        {
          ...toRequestInput(input.txParams),
          data: toRequestData(input)
        }
      ]
    }).then(ethHexToBN);
  }
);
