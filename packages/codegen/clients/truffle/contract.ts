import {
  InterfaceDeclarationStructure,
  MethodDeclarationStructure
} from 'ts-simple-ast';
import {
  createContractInterfaces,
  solidityToJsInputType,
  solidityToJsOutputType
} from '../../lib';

export const createTruffleContractInterfaces = createContractInterfaces(
  (json, functions) => {
    return {
      name: json.contract_name,
      extends: ['TruffleContractInstance'],
      methods: functions.map(createMethod)
    };
  }
);

const createMethod = (
  funDesc: FunctionDescription
): MethodDeclarationStructure => {
  {
    const returnTypeArgs =
      funDesc.outputs.length === 0
        ? 'undefined'
        : funDesc.outputs.length === 1
          ? solidityToJsOutputType(funDesc.outputs[0].type)
          : `[${funDesc.outputs
              .map(o => o.type)
              .map(solidityToJsOutputType)
              .join(',')}]`;

    const parameters = funDesc.inputs.map(({ name, type }, index) => {
      return {
        name: name || 'anonymous' + index,
        type: solidityToJsInputType(type)
      };
    });

    const returnType = funDesc.constant ? returnTypeArgs : 'TransactionResult';

    return {
      name: funDesc.name,
      parameters,
      returnType: `Promise<${returnType}>`
    };
  }
};
