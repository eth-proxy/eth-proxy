import { InterfaceDeclarationStructure } from 'ts-simple-ast';

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
