import {
  InterfaceDeclarationStructure,
  PropertySignatureStructure,
  TypeAliasDeclarationStructure
} from 'ts-simple-ast';
import { chain, map, filter } from 'ramda';
import {
  solidityToJsOutputType,
  toEventPayloadName,
  toEventName,
  CreateEventDeclaraton
} from '../../../lib';

export const createEventDeclaration: CreateEventDeclaraton = (
  { name, inputs }: EventDescription,
  { contractName }: TruffleJson
) => {
  return [
    {
      name: toEventPayloadName(contractName, name),
      properties: inputs.map(({ name, type }) => ({
        name,
        type: solidityToJsOutputType(type)
      }))
    },
    {
      name: toEventName(contractName, name),
      properties: [
        {
          name: 'event',
          type: `"${name}"`
        },
        {
          name: 'args',
          type: toEventPayloadName(contractName, name)
        }
      ],
      extends: ['EventMetadata']
    }
  ];
};
