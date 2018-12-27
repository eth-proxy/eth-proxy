import { InterfaceDeclarationStructure } from 'ts-simple-ast';
import { toInputName, getInputProperty } from '../../lib';
import { hasComplexInput } from './utils';
import { TruffleJson } from '../../interfaces';
import { isFunctionAbi } from '@eth-proxy/rpc';

export function getInputInterfaces({
  contractName,
  abi
}: TruffleJson): InterfaceDeclarationStructure[] {
  const functionsWithExternalInputs = abi
    .filter(isFunctionAbi)
    .filter(hasComplexInput);

  return functionsWithExternalInputs.map(({ name, inputs }) => ({
    name: toInputName(contractName)(name!),
    properties: inputs.map(getInputProperty)
  }));
}
