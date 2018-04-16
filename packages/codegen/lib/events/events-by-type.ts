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
      ({ abi, contractName }) => ({
        name: contractName,
        type: toEventsByTypeName(contractName)
      }),
      jsons
    )
  };
}

function getContractEventsByType(
  jsons: TruffleJson[]
): InterfaceDeclarationStructure[] {
  return map(
    ({ contractName, abi }) => ({
      name: toEventsByTypeName(contractName),
      properties: abi.filter(a => a.type === 'event').map(({ name }) => ({
        name,
        type: toEventName(contractName, name)
      }))
    }),
    jsons
  );
}
