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
  solidityToJsInputType,
  createContractInterfaces
} from '../../lib';

export const createEthProxyContractInterfaces = createContractInterfaces(
  ({ contract_name }, functions) => {
    return {
      name: contract_name,
      properties: map(getMethodDefinition(contract_name), functions)
    };
  }
);

const getMethodDefinition = (contractName: string) => (
  fun: FunctionDescription
): PropertySignatureStructure => {
  return {
    name: fun.name,
    type: toMethodDefinitionName(contractName, fun.name)
  };
};
