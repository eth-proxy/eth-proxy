import { SourceFileStructure } from 'ts-simple-ast';
import {
  getRootContractsEventsAlias,
  getContractEventsAliases
} from './events';
import { assoc } from 'ramda';
import { numberLike } from './common/numberlike';
import { transactionOptions } from './transaction';

export const getCommonSource = (
  contracts: TruffleJson[]
): SourceFileStructure => {
  return {
    interfaces: [transactionOptions].map(assoc('isExported', true)),
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
