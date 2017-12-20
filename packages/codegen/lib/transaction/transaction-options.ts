import { InterfaceDeclarationStructure } from 'ts-simple-ast';

export const transactionOptions: InterfaceDeclarationStructure = {
  name: 'TransactionOptions',
  properties: [
    {
      name: 'from',
      type: 'string',
      hasQuestionToken: true
    },
    {
      name: 'value',
      type: 'NumberLike',
      hasQuestionToken: true
    },
    {
      name: 'gas',
      type: 'NumberLike',
      hasQuestionToken: true
    },
    {
      name: 'gasPrice',
      type: 'NumberLike',
      hasQuestionToken: true
    }
  ]
};
