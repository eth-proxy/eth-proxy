import { SourceFileStructure } from 'ts-simple-ast';
import { imports } from './imports';
import { createEthProxyContractInterfaces } from './contract';
import { createEventInterface } from './events';
import { createEventInterfaces } from '../../lib';
import { getOutputInterfaces } from './outputs';
import { getInputInterfaces } from './inputs';
import { getMethodsInterfaces } from './methods';
import { chain, assoc } from 'ramda';
import { TruffleJson } from '../../interfaces';
import { getAllContractsInterface } from '../../lib/common/contracts';

export function getSourceFile(contracts: TruffleJson[]): SourceFileStructure {
  return {
    bodyText: `declare module '@eth-proxy/client' {
  const C: RequestFactory<Contracts>;
  function entity <T>(model: EntityModel<T, EventsByType, Contracts>): EntityModel<T, EventsByType, Contracts>
}
`,
    imports,
    interfaces: [
      getAllContractsInterface(contracts),
      ...createEthProxyContractInterfaces(contracts),
      ...chain(getMethodsInterfaces, contracts),
      ...chain(getInputInterfaces, contracts),
      ...chain(getOutputInterfaces, contracts),
      ...createEventInterfaces(createEventInterface)(contracts)
    ].map(assoc('isExported', true))
  };
}
