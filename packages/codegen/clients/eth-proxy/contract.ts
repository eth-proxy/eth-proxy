import { PropertySignatureStructure } from 'ts-simple-ast';
import { map } from 'ramda';
import { toMethodDefinitionName } from './utils';
import { createContractInterfaces } from '../../lib';
import { FunctionDescription } from '../../interfaces';

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
