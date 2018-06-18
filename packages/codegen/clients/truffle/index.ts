import { SourceFileStructure } from 'ts-simple-ast';
import { createEventInterfaces } from '../../lib';
import { assoc } from 'ramda';

import { createEventDeclaration, eventMetadata } from './events';
import { createTruffleContractInterfaces } from './contract';
import { transactionResult } from './transaction-result';
import { contractInstance } from './contract-instance';
import { receipt } from './receipt';
import { contractAbstracion } from './contract-abstraction';
import { TruffleJson } from '../../interfaces';
import { getAllContractsInterface } from '../../lib/common/contracts';

export function getSourceFile(contracts: TruffleJson[]): SourceFileStructure {
  return {
    enums: [buildContractNamesEnum(contracts)].map(assoc('isExported', true)),
    interfaces: [
      getAllContractsInterface(contracts),
      ...createTruffleContractInterfaces(contracts),
      ...createEventInterfaces(createEventDeclaration)(contracts),
      eventMetadata,
      transactionResult,
      contractInstance,
      receipt,
      contractAbstracion
    ].map(assoc('isExported', true))
  };
}

export const buildContractNamesEnum = (contracts: TruffleJson[]) => ({
  name: 'ContractsNames',
  members: contracts.map(({ contractName }) => ({
    name: contractName,
    value: contractName
  }))
});
