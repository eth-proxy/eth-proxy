import { TypeAliasDeclarationStructure } from 'ts-simple-ast';
import { toContractEventsName } from '../utils';
import { map } from 'ramda';
import { TruffleJson } from '../../interfaces';

export function getRootContractsEventsAlias(
  jsons: TruffleJson[]
): TypeAliasDeclarationStructure {
  const contractsEvents = map(
    ({ contractName }) => toContractEventsName(contractName)(''),
    jsons
  );
  const contractsEventsUnion = contractsEvents.join(' | ');

  return {
    name: 'ContractsEvents',
    type: contractsEventsUnion
  };
}
