import {
  InterfaceDeclarationStructure,
  PropertySignatureStructure
} from 'ts-simple-ast';
import { toOutputName, getOutputProperty } from '../../lib';
import { hasComplexOutput } from './utils';

export function getOutputInterfaces({
  contractName,
  abi
}: TruffleJson): InterfaceDeclarationStructure[] {
  const functionsWithOutputs = abi.filter(
    hasComplexOutput
  ) as FunctionDescription[];

  return functionsWithOutputs.map(({ name, outputs }) => ({
    name: toOutputName(contractName)(name),
    properties: outputs.map(getOutputProperty)
  }));
}
