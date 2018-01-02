import { InterfaceDeclarationStructure } from 'ts-simple-ast';
import {
  toContractEventsName,
  toEventName,
  toEventsByTypeName
} from '../utils';
import { map, chain, converge } from 'ramda';
import { concat } from 'ramda';

export const getEventsByTypeIntefaces = (jsons: TruffleJson[]) => [
  getEventsByContract(jsons),
  ...getContractEventsByType(jsons)
];

function getEventsByContract(
  jsons: TruffleJson[]
): InterfaceDeclarationStructure {
  return {
    name: 'EventsByType',
    properties: map(
      ({ abi, contract_name }) => ({
        name: contract_name,
        type: toEventsByTypeName(contract_name)
      }),
      jsons
    )
  };
}

function getContractEventsByType(
  jsons: TruffleJson[]
): InterfaceDeclarationStructure[] {
  return map(
    ({ contract_name, abi }) => ({
      name: toEventsByTypeName(contract_name),
      properties: abi.filter(a => a.type === 'event').map(({ name }) => ({
        name,
        type: toEventName(contract_name, name)
      }))
    }),
    jsons
  );
}
