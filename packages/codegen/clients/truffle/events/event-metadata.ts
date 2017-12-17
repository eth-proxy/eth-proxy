import { InterfaceDeclarationStructure } from 'ts-simple-ast';

export const eventMetadata: InterfaceDeclarationStructure = {
  name: 'EventMetadata',
  properties: [
    {
      name: 'type',
      type: 'string'
    },
    {
      name: 'address',
      type: 'string'
    },
    {
      name: 'logIndex',
      type: 'number'
    },
    {
      name: 'transactionHash',
      type: 'string'
    },
    {
      name: 'transactionIndex',
      type: 'number'
    },
    {
      name: 'blockHash',
      type: 'string'
    },
    {
      name: 'blockNumber',
      type: 'number'
    }
  ]
};
