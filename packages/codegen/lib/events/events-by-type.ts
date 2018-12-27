import { InterfaceDeclarationStructure } from 'ts-simple-ast';
import { toEventName, toEventsByTypeName } from '../utils';
import { map } from 'ramda';
import { TruffleJson } from '../../interfaces';
import { isEventAbi } from '@eth-proxy/rpc';

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
      ({ contractName }) => ({
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
      properties: abi.filter(isEventAbi).map(({ name }) => ({
        name,
        type: toEventName(contractName, name)
      }))
    }),
    jsons
  );
}
