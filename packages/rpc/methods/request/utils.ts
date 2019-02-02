import { getMethodID } from 'rpc/utils';
import { encodeFromObjOrSingle } from 'rpc/coder';
import { FunctionDescription } from 'rpc/interfaces';

export interface MethodInput<T = any> {
  abi: FunctionDescription;
  args: T;
}

export function toRequestData({ abi, args }: MethodInput) {
  return getMethodID(abi) + encodeFromObjOrSingle(abi, args);
}
