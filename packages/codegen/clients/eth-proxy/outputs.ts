import { InterfaceDeclarationStructure } from 'ts-simple-ast';
import { toOutputName, getOutputProperty } from '../../lib';
import { hasComplexOutput } from './utils';
import { TruffleJson } from '../../interfaces';
import { isFunctionAbi } from '@eth-proxy/rpc';

export function getOutputInterfaces({
  contractName,
  abi
}: TruffleJson): InterfaceDeclarationStructure[] {
  return abi
    .filter(isFunctionAbi)
    .filter(hasComplexOutput)
    .map(({ name, outputs }) => ({
      name: toOutputName(contractName)(name),
      properties: outputs.map(getOutputProperty)
    }));
}
