import { InterfaceDeclarationStructure } from 'ts-simple-ast';

export const receipt: InterfaceDeclarationStructure = {
  name: 'Receipt',
  properties: [
    {
      name: 'blockHash',
      type: 'string'
    },
    {
      name: 'blockNumber',
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
      name: 'from',
      type: 'string'
    },
    {
      name: 'to',
      type: 'string'
    },
    {
      name: 'cumulativeGasUsed',
      type: 'number'
    },
    {
      name: 'gasUsed',
      type: 'number'
    },
    {
      name: 'contractAddress',
      type: 'string | null'
    },
    {
      name: 'logs',
      type: 'any[]'
    }
  ]
};
