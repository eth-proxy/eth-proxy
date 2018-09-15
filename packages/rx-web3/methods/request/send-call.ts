import { curry, pipe } from 'ramda';
import { getMethodID, send, strip0x, extractNonTuple } from '../../utils';
import { Observable } from 'rxjs';
import {
  Provider,
  RequestInputParams,
  Tag,
  NumberLike,
  FunctionDescription
} from '../../interfaces';
import { map } from 'rxjs/operators';
import { formatRequestInput, encodeArgs, decodeArgs } from './formatters';
import { formatDefaultBlock } from '../../formatters';

export interface CallInput<T = any> {
  abi: FunctionDescription;
  args: T;
  txParams: RequestInputParams;
  atBlock?: Tag | NumberLike;
}

export const sendCall = curry(
  (provider: Provider, input: CallInput): Observable<string> => {
    return sendCallWithPayload(
      provider,
      {
        ...input.txParams,
        data: toData(input)
      },
      input.atBlock
    ).pipe(map(fromResult(input)));
  }
);

function toData({ abi, args }: CallInput) {
  return getMethodID(abi) + encodeArgs(abi, args);
}

export function sendCallWithPayload<T>(
  provider: Provider,
  payload: RequestInputParams,
  defaultBlock: Tag | NumberLike = 'latest'
) {
  return send(provider)({
    method: 'eth_call',
    params: [formatRequestInput(payload), formatDefaultBlock(defaultBlock)]
  }).pipe(map(x => x.result)) as Observable<T>;
}

const fromResult = curry(({ abi }: CallInput, result: string) => {
  // Is this necessary?
  if (!result) {
    return result;
  }

  const decoder = decodeArgs(abi);

  return pipe(
    strip0x,
    decoder,
    extractNonTuple
  )(result);
});
