import { SourceFileStructure } from 'ts-simple-ast';
import {
  getRootContractsEventsAlias,
  getContractEventsAliases,
  getEventsByTypeIntefaces
} from './events';
import { assoc } from 'ramda';
import { numberLike } from './common/numberlike';
import { transactionOptions } from './transaction';
import { TruffleJson } from '../interfaces';

export const getCommonSource = (
  contracts: TruffleJson[]
): SourceFileStructure => {
  return {
    interfaces: [
      ...getEventsByTypeIntefaces(contracts),
      transactionOptions
    ].map(assoc('isExported', true)),
    typeAliases: [
      ...getContractEventsAliases(contracts),
      getRootContractsEventsAlias(contracts),
      numberLike()
    ].map(assoc('isExported', true)),
    imports: [
      {
        namedImports: [{ name: 'BigNumber' }],
        moduleSpecifier: 'bignumber.js'
      }
    ]
  };
};

export * from './events';
export * from './utils';
export * from './contract';
export * from './transaction';
