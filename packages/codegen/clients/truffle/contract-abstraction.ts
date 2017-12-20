import { InterfaceDeclarationStructure } from 'ts-simple-ast';

export const contractAbstracion: InterfaceDeclarationStructure = {
  name: 'TruffleContractAbstraction',
  typeParameters: [{ name: 'T', constraint: 'TruffleContractInstance' }],
  properties: [
    {
      name: 'abi',
      type: 'any[]'
    },
    {
      name: 'networks',
      type: 'any[]'
    },
    {
      name: 'network',
      type: 'any'
    }
  ],
  methods: [
    {
      name: 'at',
      parameters: [{ name: 'address', type: 'string' }],
      returnType: 'Promise<T>'
    },
    {
      name: 'setProvider',
      parameters: [{ name: 'provider', type: 'any' }],
      returnType: 'void'
    },
    {
      name: 'deployed',
      returnType: 'Promise<T>'
    },
    {
      name: 'link',
      typeParameters: [{ name: 'V', constraint: 'TruffleContractInstance' }],
      parameters: [
        {
          name: 'contract',
          type: 'TruffleContractAbstraction<V>'
        }
      ],
      returnType: 'void'
    },
    {
      name: 'link',
      typeParameters: [{ name: 'V', constraint: 'TruffleContractInstance' }],
      parameters: [
        {
          name: 'name',
          type: 'string'
        },
        {
          name: 'address',
          type: 'string'
        }
      ],
      returnType: 'void'
    },
    {
      name: 'setNetwork',
      parameters: [
        {
          name: 'networkId',
          type: 'string'
        }
      ],
      returnType: 'void'
    },
    {
      name: 'hasNetwork',
      parameters: [
        {
          name: 'networkId',
          type: 'string'
        }
      ],
      returnType: 'boolean'
    },
    {
      name: 'defaults',
      parameters: [
        {
          name: 'defaults',
          type: 'TransactionOptions'
        }
      ],
      returnType: 'void'
    },
    {
      name: 'clone',
      parameters: [
        {
          name: 'networkId',
          type: 'string'
        }
      ],
      returnType: 'TruffleContractAbstraction<T>'
    }
  ],
  constructSignatures: [
    {
      parameters: [{ name: 'args', type: 'any[]', isRestParameter: true }],
      returnType: 'Promise<T>'
    }
  ]
};
