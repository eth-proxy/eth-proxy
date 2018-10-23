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
import { formatBlockNr } from '../../formatters';

export interface CallInput<T = any> {
  abi: FunctionDescription;
  args: T;
  txParams: RequestInputParams;
  atBlock?: Tag | NumberLike;
}

export const sendCall = curry(
  (input: CallInput, provider: Provider): Observable<any> => {
    const { atBlock = 'latest' } = input;
    const request = {
      ...input.txParams,
      data: toData(input)
    };
    const resultParser = fromResult(input);

    return send(provider)({
      method: 'eth_call',
      params: [formatRequestInput(request), formatBlockNr(atBlock)]
    }).pipe(map(resultParser));
  }
);

function toData({ abi, args }: CallInput) {
  return getMethodID(abi) + encodeArgs(abi, args);
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
