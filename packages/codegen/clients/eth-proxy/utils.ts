import { toName } from '../../lib';
import { FunctionDescription, AbiDefinition } from '../../interfaces';

export function hasComplexInput({ inputs, type }: AbiDefinition): boolean {
  return type === 'function' && inputs.length > 1;
}

export function hasComplexOutput({
  type,
  outputs
}: FunctionDescription): boolean {
  return type === 'function' && outputs.length > 1;
}

export const toMethodDefinitionName = toName('Definition');
