import {
  InterfaceDeclarationStructure,
  PropertySignatureStructure
} from 'ts-simple-ast';
import {
  toInputName,
  solidityToJsInputType,
  getInputProperty
} from '../../lib';
import { hasComplexInput } from './utils';

export function getInputInterfaces({
  contractName,
  abi
}: TruffleJson): InterfaceDeclarationStructure[] {
  const functionsWithExternalInputs = abi.filter(
    hasComplexInput
  ) as FunctionDescription[];

  return functionsWithExternalInputs.map(({ name, inputs }) => ({
    name: toInputName(contractName)(name),
    properties: inputs.map(getInputProperty)
  }));
}
