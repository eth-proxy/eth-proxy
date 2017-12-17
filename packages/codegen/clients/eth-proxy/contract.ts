import {
  InterfaceDeclarationStructure,
  PropertySignatureStructure,
  ParameterDeclarationStructure
} from 'ts-simple-ast';
import { map } from 'ramda';
import { hasComplexInput, toMethodDefinitionName } from './utils';
import {
  toOutputName,
  toInputName,
  solidityToJsOutputType,
  solidityToJsInputType
} from '../../lib';

export function getContractInterface({
  contract_name,
  abi
}: TruffleJson): InterfaceDeclarationStructure {
  const functions = abi.filter(({ type }) => type === 'function');
  const getInputName = toInputName(contract_name);
  return {
    name: contract_name,
    properties: map(getMethodDefinition(contract_name), functions),
    extends: ['ContractDefinition']
  };
}

const getMethodDefinition = (contractName: string) => (
  fun: FunctionDescription
): PropertySignatureStructure => {
  return {
    name: fun.name,
    type: toMethodDefinitionName(contractName, fun.name)
  };
};
