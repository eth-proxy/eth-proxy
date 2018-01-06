import { InterfaceDeclarationStructure } from 'ts-simple-ast';

export const contractInstance: InterfaceDeclarationStructure = {
  name: 'TruffleContractInstance',
  properties: [
    {
      name: 'allEvents',
      type: 'any'
    },
    {
      name: 'address',
      type: 'string'
    },
    {
      name: 'abi',
      type: 'any[]'
    },
    {
      name: 'contract',
      type: 'any'
    },
    {
      name: 'constructor',
      type: `{ currentProvider: any; contractName: string }`
    }
  ]
};
