import { InterfaceDeclarationStructure } from 'ts-simple-ast';
import { toMethodDefinitionName } from './utils';
import {
  toOutputName,
  toInputName,
  solidityToJsOutputType,
  solidityToJsInputType
} from '../../lib';
import { TruffleJson } from '../../interfaces';
import { isFunctionAbi, FunctionDescription } from '@eth-proxy/rpc';

export function getMethodsInterfaces({
  contractName,
  abi
}: TruffleJson): InterfaceDeclarationStructure[] {
  return abi.filter(isFunctionAbi).map(getMethodDefinition(contractName));
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
