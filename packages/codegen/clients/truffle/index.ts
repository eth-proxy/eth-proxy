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

export function getSourceFile(contracts: TruffleJson[]): SourceFileStructure {
  return {
    interfaces: [
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
