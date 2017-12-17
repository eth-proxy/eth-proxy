import {
  InterfaceDeclarationStructure,
  PropertySignatureStructure
} from 'ts-simple-ast';
import { toOutputName, getOutputProperty } from '../../lib';
import { hasComplexOutput } from './utils';

export function getOutputInterfaces({
  contract_name,
  abi
}: TruffleJson): InterfaceDeclarationStructure[] {
  const functionsWithOutputs = abi.filter(
    hasComplexOutput
  ) as FunctionDescription[];

  return functionsWithOutputs.map(({ name, outputs }) => ({
    name: toOutputName(contract_name)(name),
    properties: outputs.map(getOutputProperty)
  }));
}
