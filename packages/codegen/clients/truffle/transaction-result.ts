import { InterfaceDeclarationStructure } from 'ts-simple-ast';

export const transactionResult: InterfaceDeclarationStructure = {
  name: 'TransactionResult',
  properties: [
    {
      name: 'logs',
      type: 'ContractsEvents[]'
    },
    {
      name: 'receipt',
      type: 'Receipt'
    },
    {
      name: 'tx',
      type: 'string'
    }
  ]
};
