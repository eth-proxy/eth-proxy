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
  contract_name,
  abi
}: TruffleJson): InterfaceDeclarationStructure[] {
  const functionsWithExternalInputs = abi.filter(
    hasComplexInput
  ) as FunctionDescription[];

  return functionsWithExternalInputs.map(({ name, inputs }) => ({
    name: toInputName(contract_name)(name),
    properties: inputs.map(getInputProperty)
  }));
}
