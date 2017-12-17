import { toName } from "../../lib";
import { CurriedFunction2 } from 'ramda';
export function hasComplexInput({ inputs, type }: AbiDefinition): boolean {
  return type === "function" && inputs.length > 1;
}

export function hasComplexOutput({
  type,
  outputs
}: FunctionDescription): boolean {
  return type === "function" && outputs.length > 1;
}

export const toMethodDefinitionName = toName("Definition");