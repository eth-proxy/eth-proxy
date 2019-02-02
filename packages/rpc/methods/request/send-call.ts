import { curry, pipe } from 'ramda';
import { send, strip0x, extractNonTuple } from '../../utils';
import {
  Provider,
  RequestInputParams,
  Tag,
  NumberLike
} from '../../interfaces';
import { toBlockNr, toRequestInput } from '../../converters';
import { decodeToObj } from '../../coder';
import { MethodInput, toRequestData } from './utils';

export interface CallInput<T = any> extends MethodInput<T> {
  txParams: RequestInputParams;
  atBlock?: Tag | NumberLike;
}

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call
 */
export const sendCall = curry(
  (provider: Provider, input: CallInput): Promise<any> => {
    const { atBlock = 'latest' } = input;
    const request = {
      ...toRequestInput(input.txParams),
      data: toRequestData(input)
    };
    const resultParser = fromResult(input);

    return send(provider)({
      method: 'eth_call',
      params: [request, toBlockNr(atBlock)]
    }).then(resultParser);
  }
);

const fromResult = curry(({ abi }: CallInput, result: string) => {
  const decode = decodeToObj(abi.outputs || []);

  return pipe(
    strip0x,
    decode,
    extractNonTuple
  )(result);
});
