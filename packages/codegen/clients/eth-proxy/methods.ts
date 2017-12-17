import {
  InterfaceDeclarationStructure,
  PropertySignatureStructure,
  ParameterDeclarationStructure
} from 'ts-simple-ast';
import { map } from 'ramda';
import { hasComplexInput, toMethodDefinitionName } from './utils';
import {
  toOutputName,
  toInputName,
  solidityToJsOutputType,
  solidityToJsInputType
} from '../../lib';

export function getMethodsInterfaces({
  contract_name,
  abi
}: TruffleJson): InterfaceDeclarationStructure[] {
  const functions = abi.filter(({ type }) => type === 'function');
  const getInputName = toInputName(contract_name);
  return functions.map(getMethodDefinition(contract_name));
}

const getMethodDefinition = (contractName: string) => (
  fun: FunctionDescription
): InterfaceDeclarationStructure => {
  const callOutputName =
    fun.outputs.length > 1
      ? toOutputName(contractName)(fun.name)
      : fun.outputs.length === 0
        ? 'undefined'
        : solidityToJsOutputType(fun.outputs[0].type);

  const optionalProperties =
    fun.inputs.length > 0
      ? [
          {
            name: 'in',
            type:
              fun.inputs.length > 1
                ? toInputName(contractName)(fun.name)
                : solidityToJsInputType(fun.inputs[0].type)
          }
        ]
      : [];

  return {
    name: toMethodDefinitionName(contractName, fun.name),
    properties: [
      ...optionalProperties,
      {
        name: 'out',
        type: callOutputName
      },
      {
        name: 'events',
        type: 'ContractsEvents'
      }
    ]
  };
};
