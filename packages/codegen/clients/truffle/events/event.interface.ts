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
  { contract_name }: TruffleJson
) => {
  return [
    {
      name: toEventPayloadName(contract_name, name),
      properties: inputs.map(({ name, type }) => ({
        name,
        type: solidityToJsOutputType(type)
      }))
    },
    {
      name: toEventName(contract_name, name),
      properties: [
        {
          name: 'event',
          type: `"${name}"`
        },
        {
          name: 'args',
          type: toEventPayloadName(contract_name, name)
        }
      ],
      extends: ['EventMetadata']
    }
  ];
};
