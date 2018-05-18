import { SourceFileStructure } from 'ts-simple-ast';
import { imports } from './imports';
import { createEthProxyContractInterfaces } from './contract';
import { createEventInterface } from './events';
import { createEventInterfaces } from '../../lib';
import { getRootInterface } from './root';
import { getOutputInterfaces } from './outputs';
import { getInputInterfaces } from './inputs';
import { getMethodsInterfaces } from './methods';
import { chain, assoc } from 'ramda';
import { TruffleJson } from '../../interfaces';

export function getSourceFile(contracts: TruffleJson[]): SourceFileStructure {
  return {
    imports,
    interfaces: [
      getRootInterface(contracts),
      ...createEthProxyContractInterfaces(contracts),
      ...chain(getMethodsInterfaces, contracts),
      ...chain(getInputInterfaces, contracts),
      ...chain(getOutputInterfaces, contracts),
      ...createEventInterfaces(createEventInterface)(contracts)
    ].map(assoc('isExported', true))
  };
}
