import { curry, pipe } from 'ramda';
import { getMethodID, send, strip0x, extractNonTuple } from '../../utils';
import {
  Provider,
  RequestInputParams,
  Tag,
  NumberLike,
  FunctionDescription
} from '../../interfaces';
import { toBlockNr, toRequestInput } from '../../converters';
import { decodeToObj, encodeFromObjOrSingle } from '../../coder';

export interface CallInput<T = any> {
  abi: FunctionDescription;
  args: T;
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
      ...input.txParams,
      data: toData(input)
    };
    const resultParser = fromResult(input);

    return send(provider)({
      method: 'eth_call',
      params: [toRequestInput(request), toBlockNr(atBlock)]
    }).then(resultParser);
  }
);

function toData({ abi, args }: CallInput) {
  return getMethodID(abi) + encodeFromObjOrSingle(abi, args);
}

const fromResult = curry(({ abi }: CallInput, result: string) => {
  const decode = decodeToObj(abi.outputs || []);

  return pipe(
    strip0x,
    decode,
    extractNonTuple
  )(result);
});
