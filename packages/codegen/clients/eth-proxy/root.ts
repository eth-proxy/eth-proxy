import { InterfaceDeclarationStructure } from 'ts-simple-ast';
import { TruffleJson } from '../../interfaces';

export function getRootInterface(
  contracts: TruffleJson[]
): InterfaceDeclarationStructure {
  return {
    name: 'Contracts',
    properties: contracts.map(({ contractName }) => ({
      name: contractName,
      type: contractName
    }))
  };
}
