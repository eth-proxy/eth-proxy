import { TypeAliasDeclarationStructure } from 'ts-simple-ast';
import { map } from 'ramda';
import { toEventName, toContractEventsName } from '../utils';
import { TruffleJson } from '../../interfaces';
import { isEventAbi } from '@eth-proxy/rpc';

export const getContractEventsAliases = map(getContractEventAlias);

export function getContractEventAlias({
  contractName,
  abi
}: TruffleJson): TypeAliasDeclarationStructure {
  const eventAbis = abi.filter(isEventAbi);

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
