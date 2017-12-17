import { TypeAliasDeclarationStructure } from 'ts-simple-ast';
import { toContractEventsName } from '../utils';
import { map } from 'ramda';

export function getRootContractsEventsAlias(
  jsons: TruffleJson[]
): TypeAliasDeclarationStructure {
  const contractsEvents = map(
    ({ contract_name }) => toContractEventsName(contract_name)(''),
    jsons
  );
  const contractsEventsUnion = contractsEvents.join(' | ');

  return {
    name: 'ContractsEvents',
    type: contractsEventsUnion
  };
}
