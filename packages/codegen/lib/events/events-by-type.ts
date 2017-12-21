import { InterfaceDeclarationStructure } from 'ts-simple-ast';
import { toContractEventsName, toEventName } from '../utils';
import { map, chain } from 'ramda';

export function getEventsByType(
  jsons: TruffleJson[]
): InterfaceDeclarationStructure {
  const properties = chain(
    ({ abi, contract_name }) =>
      abi.filter(a => a.type === 'event').map(({ name }) => ({
        name,
        type: toEventName(contract_name, name)
      })),
    jsons
  );

  return {
    name: 'EventsByType',
    properties
  };
}
