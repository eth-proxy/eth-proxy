import { TypeAliasDeclarationStructure } from 'ts-simple-ast';
import { map } from 'ramda';
import { toEventName, toContractEventsName } from '../utils';

export const getContractEventsAliases = map(getContractEventAlias);

export function getContractEventAlias({
  contractName,
  abi
}: TruffleJson): TypeAliasDeclarationStructure {
  const eventAbis = abi.filter(a => a.type === 'event') as EventDescription[];

  const contractEvents = map(
    ({ name }) => toEventName(contractName, name),
    eventAbis
  );
  const eventsUnion = contractEvents.join(' | ');

  return {
    name: toContractEventsName(contractName)(''),
    type: eventsUnion || 'never'
  };
}
