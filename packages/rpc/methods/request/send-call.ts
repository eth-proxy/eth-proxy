import { pipe } from 'ramda';
import {
  getMethodID,
  strip0x,
  extractNonTuple,
  createMethod,
  RequestDef
} from '../../utils';
import {
  RequestInputParams,
  Tag,
  NumberLike,
  FunctionDescription,
  EthCallRequest,
  EthCall
} from '../../interfaces';
import { toBlockNr, toRequestInput } from '../../converters';
import { decodeToObj, encodeFromObjOrSingle } from '../../coder';

export interface CallInput<T = any> {
  abi: FunctionDescription;
  args: T;
  txParams: RequestInputParams;
  atBlock?: Tag | NumberLike;
}

function toRequest(input: CallInput): EthCallRequest {
  const { atBlock = 'latest' } = input;
  const request = {
    ...input.txParams,
    data: toData(input)
  };
  return {
    method: 'eth_call',
    params: [toRequestInput(request), toBlockNr(atBlock)]
  };
}

function toData({ abi, args }: CallInput) {
  return getMethodID(abi) + encodeFromObjOrSingle(abi, args);
}

const fromResult = (result: string, { abi }: CallInput): any => {
  const decode = decodeToObj(abi.outputs || []);

  return pipe(
    strip0x,
    decode,
    extractNonTuple
  )(result);
};

const callDef = {
  request: toRequest,
  result: fromResult
};

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call
 */
export const sendCallReq = <T>(input: CallInput<T>): RequestDef<EthCall, T> => {
  return {
    payload: toRequest(input),
    parseResult: x => fromResult(x, input)
  };
};

/**
 * https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call
 */
export const sendCall = createMethod(callDef);
