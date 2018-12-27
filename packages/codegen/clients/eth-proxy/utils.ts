import { toName } from '../../lib';
import { FunctionDescription } from '@eth-proxy/rpc';

export function hasComplexInput({ inputs }: FunctionDescription): boolean {
  return inputs.length > 1;
}

export function hasComplexOutput({
  type,
  outputs
}: FunctionDescription): boolean {
  return type === 'function' && outputs.length > 1;
}

export const toMethodDefinitionName = toName('Definition');
