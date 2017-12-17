import { InterfaceDeclarationStructure } from 'ts-simple-ast';

export function getRootInterface(
  contracts: TruffleJson[]
): InterfaceDeclarationStructure {
  return {
    name: 'Contracts',
    properties: contracts.map(({ contract_name }) => ({
      name: contract_name,
      type: contract_name
    })),
    extends: ['ContractsAggregation']
  };
}
