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
  ({ contractName }, functions) => {
    return {
      name: contractName,
      properties: map(getMethodDefinition(contractName), functions)
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
